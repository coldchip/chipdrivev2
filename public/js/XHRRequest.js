/*
	@title: ChipDrive XHRRequest HTTP API
	@author: Ryan Loh
	@description: A library to perform CRUD requests to ChipDrive server
*/

class XHRRequest {
	static TIMEOUT = 15000;

	static _send(opts) {
		var {
			method, 
			url, 
			query, 
			header, 
			timeout, 
			progress, 
			body
		} = opts;

		return new Promise((resolve, reject) => {
			var xhr = new XMLHttpRequest();

			if(query) {
				url = url.concat("?", new URLSearchParams(query).toString());
			}

			xhr.open(method, url, true);

			if(header) {
				for(const [key, value] of Object.entries(header)) {
					xhr.setRequestHeader(key, value);
				}
			}

			if(progress) {
				xhr.upload.onprogress = (event) => {
				if (event.lengthComputable) {
						progress((event.loaded / event.total) * 100);
					}
				}
			}

			if(timeout) {
				xhr.timeout = timeout;
			}

			xhr.onreadystatechange = function() {
				if(xhr.readyState === 4) {
					if(xhr.status >= 100 && xhr.status <= 599) {
						var basetype = Math.floor(xhr.status / 100);

						var response = {
							status: xhr.status,
							body: JSON.parse(xhr.responseText)
						};

						if(basetype === 2) {
							resolve(response);
						} else {
							reject(response);
						}
					}
				}
			}

			xhr.onerror = (e) => {
				var response = {
					status: 0,
					body: {
						code: 0,
						message: "Request error, is the network down?"
					}
				};
				reject(response);
			}

			xhr.onabort = (e) => {
				var response = {
					status: 0,
					body: {
						code: 0,
						message: "Request aborted"
					}
				};
				reject(response);
			}

			xhr.ontimeout = (e) => {
				var response = {
					status: 0,
					body: {
						code: 0,
						message: "Request timeout, please try again"
					}
				};
				reject(response);
			};

			xhr.send(body ? body : null);
		});
	}

	static get(url, query) {
		var opts = {
			method: "GET",
			url: url,
			query: query,
			timeout: XHRRequest.TIMEOUT
		};
		return XHRRequest._send(opts);
	}

	static post(url, body) {
		var opts = {
			method: "POST",
			url: url,
			header: {
				"Content-Type": "application/x-www-form-urlencoded"
			},
			timeout: XHRRequest.TIMEOUT,
			body: new URLSearchParams(body).toString()
		};
		return XHRRequest._send(opts);
	}

	static put(url, blob, progress) {
		var opts = {
			method: "PUT",
			url: url,
			header: {
				"Content-Type": "application/octet-stream"
			},
			progress: progress,
			body: blob
		};
		return XHRRequest._send(opts);
	}

	static patch(url, body) {
		var opts = {
			method: "PATCH",
			url: url,
			header: {
				"Content-Type": "application/x-www-form-urlencoded"
			},
			timeout: XHRRequest.TIMEOUT,
			body: new URLSearchParams(body).toString()
		};
		return XHRRequest._send(opts);
	}

	static delete(url) {
		var opts = {
			method: "DELETE",
			url: url,
			timeout: XHRRequest.TIMEOUT
		};
		return XHRRequest._send(opts);
	}
}

export default XHRRequest;