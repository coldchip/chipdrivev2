import aesjs from 'aes-js';

self.addEventListener('install', function(event) {
	// Skip the 'waiting' lifecycle phase, to go directly from 'installed' to 'activated', even if
	// there are still previous incarnations of this service worker registration active.
	event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', function(event) {
	// Claim any clients immediately, so that the page will be under SW control without reloading.
	event.waitUntil(self.clients.claim());
});

function nearestBlock(value, roundTo) {
	if(value % roundTo == 0) {
		return value;
	}
	return Math.floor(value / roundTo) * roundTo;
}

var CHUNK_SIZE = 1048576;

async function requestChunk(start, end, id) {
	// clamp it to the chunk size 
	console.log("RS", (end - start) + 1, CHUNK_SIZE);
	if((end - start) + 1 > CHUNK_SIZE) {
		end = (start + CHUNK_SIZE) - 1;
	}

	var startBlock = nearestBlock(start, 16);
	var response = await fetch(`/api/v2/drive/object/${id}/${startBlock}/${end}`, {
		headers: {

		}
	});

	var data = new Uint8Array(await response.arrayBuffer());

	var key = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32 ];
	var aesCtr = new aesjs.ModeOfOperation.ctr(key, new aesjs.Counter(startBlock / 16));

	var decrypted = aesCtr.decrypt(data).slice(start - startBlock);

	var total = response.headers.get("total-size");
	var size = response.headers.get("content-length");

	return {
		total: total,
		size: size,
		start: start,
		end: Math.min((start + size) - 1, total - 1),
		buffer: decrypted
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
			var actualEnd = Math.min((start + chunk.size) - 1, chunk.total - 1);

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