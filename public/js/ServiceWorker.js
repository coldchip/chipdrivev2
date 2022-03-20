import DeferredPromise from './DeferredPromise';

const tasks = {};

self.addEventListener('install', function(event) {
	event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', function(event) {
	event.waitUntil(self.clients.claim());
});

var CHUNK_SIZE = 1048576;

function getChunk(event, start, end, id) {
	return clients.get(event.clientId).then((client) => {
		if(client) {
			var taskid = Math.random().toString();

			var task = new DeferredPromise();
			tasks[taskid] = task;
			client.postMessage({
				taskid: taskid,
				id: id,
				start: start,
				end: end
			});
			return task.promise;
		}
	});
}

function streamDecrypt(event) {
	var request = event.request;

	var id = request.url.split("/")[4];

	if(request.headers.has("range")) {
		var range = request.headers.get("range");
		var [start, end] = range.replace(/bytes=/, "").split("-");

		start = start ? parseInt(start, 10) : 0;
		end = end ? parseInt(end, 10) : (start + CHUNK_SIZE) - 1;

		return getChunk(event, start, end, id).then((chunk) => {
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
		return getChunk(event, 0, 1, id).then((firstChunk) => {
			var stream = new ReadableStream({
				start(controller) {
					(async () => {
						var start = 0;
						while(start < firstChunk.total) {
							var end = (start + CHUNK_SIZE) - 1;
							var chunk = await getChunk(event, start, end, id);
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
	var response = event.data;
	for(const [taskid, task] of Object.entries(tasks)) {
		if(response.taskid === taskid) {
			task.resolve(response);
			delete tasks[taskid];
		}
	}
});

self.addEventListener('fetch', (event) => {
	var url = event.request.url;
	console.log('SW:- fetch', url);
	if (/cryptoworker\/.*/.test(url)) {
		event.respondWith(streamDecrypt(event));
	}
});