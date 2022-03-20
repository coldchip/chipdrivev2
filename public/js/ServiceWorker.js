import aesjs from 'aes-js';
import sha256 from 'js-sha256';

self.addEventListener('install', function(event) {
	event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', function(event) {
	event.waitUntil(self.clients.claim());
});

function counterOffset(iv, inc) {
	for(var i = iv.length - 1; i >= 0; i--) {
		inc += iv[i]; // add the previous value to the incrementer
		iv[i] = inc % 256; // get the first 8 bits
		inc = Math.floor(inc / 256); // carry the remainder to the next array
	}
}

function nearestBlock(value, roundTo) {
	if(value % roundTo == 0) {
		return value;
	}
	return Math.floor(value / roundTo) * roundTo;
}

var CHUNK_SIZE = 1048576;

async function requestChunk(start, end, id) {
	// clamp it to the chunk size 
	if((end - start) + 1 > CHUNK_SIZE) {
		end = (start + CHUNK_SIZE) - 1;
	}

	var startBlock = nearestBlock(start, 16);
	var response = await fetch(`/api/v2/drive/object/${id}`, {
		headers: {
			start: startBlock,
			end: end
		}
	});

	var data = new Uint8Array(await response.arrayBuffer());

	var key = sha256.create()
		.update("piskapiskapiskapiskapiska")
		.update("chipdrive")
		.array()
		.slice(0, 32);
	var iv = sha256.create()
		.update(id)
		.update("chipdrive")
		.array()
		.slice(0, 16);

	counterOffset(iv, startBlock / 16);

	var aes = new aesjs.ModeOfOperation.ctr(key, iv);

	var decrypted = aes.decrypt(data);

	var total = response.headers.get("total");
	var size = response.headers.get("content-length");

	return {
		total: total,
		size: size,
		start: start,
		end: Math.min((start + size) - 1, total - 1),
		buffer: decrypted.slice(start - startBlock) // removes unused bytes that are used for decryption
	};
}

function streamDecrypt(event) {
	var request = event.request;

	var id = request.url.split("/")[4];

	if(request.headers.has("range")) {
		var range = request.headers.get("range");
		var [start, end] = range.replace(/bytes=/, "").split("-");

		start = start ? parseInt(start, 10) : 0;
		end = end ? parseInt(end, 10) : (start + CHUNK_SIZE) - 1;

		return requestChunk(start, end, id).then((chunk) => {
			return new Response(chunk.buffer, {
				status: 206, 
				statusText: "Partial Content",
				headers: {
					'Content-Type': 'application/octet-stream',
					'Accept-Ranges': 'bytes',
					'Content-Range': `bytes ${chunk.start}-${chunk.end}/${chunk.total}`,
					'Content-Length': `${chunk.size}`,
					'Date': new Date().toUTCString(),
					'Cache-Control': 'no-store',
					'Server': 'ChipDrive ServiceWorker'
				}
			});
		});
	} else {
		return requestChunk(0, 1, id).then((firstChunk) => {
			var stream = new ReadableStream({
				start(controller) {
					(async () => {
						var start = 0;
						while(start < firstChunk.total) {
							var end = (start + CHUNK_SIZE) - 1;
							var chunk = await requestChunk(start, end, id);
							controller.enqueue(chunk.buffer);
							start += chunk.buffer.length;
						}
						return controller.close();
					})()
				}
			});

			return new Response(stream, {
				status: 200, 
				statusText: "OK",
				headers: {
					'Accept-Ranges': 'bytes',
					'Content-Type': 'application/octet-stream',
					'Content-Length': `${firstChunk.total}`,
					'Date': new Date().toUTCString(),
					'Cache-Control': 'no-store',
					'Server': 'ChipDrive ServiceWorker'
				}
			});
		});
	}
}

self.addEventListener('message', (event) => {
	console.log(event.data);
});

self.addEventListener('fetch', (event) => {
	var url = event.request.url;
	console.log('SW:- fetch', url);
	if (/cryptoworker\/.*/.test(url)) {
		event.respondWith(streamDecrypt(event));
	}
});