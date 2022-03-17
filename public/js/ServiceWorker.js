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

function nearestMultiple(value, roundTo) {
	if(value % roundTo == 0) {
		return value;
	}
	return Math.floor(value / roundTo) * roundTo;
}

async function requestChunk(start, end, id) {
	var startBlock = nearestMultiple(start, 16);

	if(isNaN(end) || (end - start) > 1024 * 1024) {
		end = start + 1024 * 1024;
	}


	var response = await fetch("/api/v2/drive/object/" + id + "/" + startBlock + "/" + end, {
		headers: {

		}
	});

	var data = new Uint8Array(await response.arrayBuffer());

	// for(var i = 0; i < data.length; i++) {
	// 	data[i] ^= 0x50;
	// }

	var key = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16 ];
	var aesCtr = new aesjs.ModeOfOperation.ctr(key, new aesjs.Counter(startBlock / 16));

	var decrypted = aesCtr.decrypt(data);

	console.log("starttttttttttt", start)

	decrypted = decrypted.slice((start - startBlock), (end - startBlock) + 1);

	return {
		total: response.headers.get("total-size"),
		size: response.headers.get("content-length"),
		start: response.headers.get("start"),
		end: response.headers.get("end"),
		data: decrypted
	};

}

function streamDecrypt(event) {
	console.log(event);

	var request = event.request;

	var id = request.url.split("/")[4];

	if(request.headers.has("range")) {
		var range = request.headers.get("range");
		var [start, end] = range.replace(/bytes=/, "").split("-");

		start = parseInt(start, 10);
		end = parseInt(end, 10);

		console.log("Range", start, end);

		return requestChunk(start, end, id).then((chunk) => {
			return new Response(chunk.data, {
				status: 206, 
				statusText: "Partial Content",
				headers: {
					'Content-Type': 'application/octet-stream',
					'Accept-Ranges': 'bytes',
					'Content-Range': `bytes ${chunk.start}-${chunk.end - 1}/${chunk.total}`,
					'Content-Length': `${chunk.size}`,
					'Date': new Date().toUTCString(),
					'Cache-Control': 'no-store',
					'Server': 'ChipDrive ServiceWorker'
				}
			});
		});
	} else {
		var CHUNK_SIZE = 1024 * 1024;

		return requestChunk(0, 1, id).then((firstChunk) => {
			var stream = new ReadableStream({
				start(controller) {
					var start = 0;
					return pump();
					function pump() {
						if(start >= firstChunk.total) {
							return controller.close();
						}
						return requestChunk(start, start + CHUNK_SIZE, id).then((chunk) => {
							controller.enqueue(chunk.data);

							start += chunk.data.byteLength;
							return pump();
						});
					}
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