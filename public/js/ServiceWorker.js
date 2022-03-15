self.addEventListener('install', function(event) {
	// Skip the 'waiting' lifecycle phase, to go directly from 'installed' to 'activated', even if
	// there are still previous incarnations of this service worker registration active.
	event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', function(event) {
	// Claim any clients immediately, so that the page will be under SW control without reloading.
	event.waitUntil(self.clients.claim());
});

async function requestChunk(event, start, end, id) {

	var client = await self.clients.get(event.clientId);
	if(!client) return;
	
	if(isNaN(end) || end > 1024 * 1024) {
		end = start + 1024 * 1024;
	}

	var response = await fetch("/api/v2/drive/object/" + id + "/" + start + "/" + end, {
		headers: {

		}
	});

	return {
		total: response.headers.get("total-size"),
		start: response.headers.get("start"),
		end: response.headers.get("end"),
		data: await response.arrayBuffer()
	};

}

var tasks = [];

async function streamDecrypt(event) {
	console.log(event);

	var request = event.request;
	console.log(request);

	var id = request.url.split("/")[4];

	if(request.headers.has("range")) {
		var range = request.headers.get("range");
		var [start, end] = range.replace(/bytes=/, "").split("-");

		start = parseInt(start, 10);
		end = parseInt(end, 10);

		console.log("Range", start, end);

		var chunk = await requestChunk(event, start, end, id);
		console.log(chunk);

		return new Response(chunk.data, {
			status: 206, 
			statusText: "Partial Content",
			headers: {
				'Content-Type': 'video/mp4',
				'Accept-Ranges': 'bytes',
				'Content-Range': `bytes ${chunk.start}-${chunk.end - 1}/${chunk.total}`,
				'Content-Length': `${chunk.data.byteLength}`
			}
		});
	} else {
		return fetch("/api/v2/drive/object/" + id);
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