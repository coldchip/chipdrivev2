/*
	@title: ChipDrive IO HTTP API
	@author: Ryan Loh
	@description: A library to perform CRUD requests to ChipDrive server
*/


function fetch(url, opts) {
	var {
		method, 
		query, 
		headers, 
		timeout, 
		progress, 
		body
	} = opts;

	return new Promise((resolve, reject) => {
		var xhr = new XMLHttpRequest();

		if(query) {
			url = url.concat("?", new URLSearchParams(query).toString());
		}

		xhr.open(method ? method : "GET", url, true);

		if(headers) {
			for(const [key, value] of Object.entries(headers)) {
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
		} else {
			xhr.timeout = 30000;
		}

		xhr.onreadystatechange = function() {
			if(xhr.readyState === 4) {
				if(xhr.status >= 100 && xhr.status <= 599) {
					var basetype = Math.floor(xhr.status / 100);

					try {
						var response = {
							status: xhr.status,
							body: JSON.parse(xhr.responseText)
						};

						if(basetype === 2) {
							resolve(response);
						} else {
							reject(response);
						}
					} catch(e) {
						var response = {
							status: 0,
							body: {
								code: 0,
								message: "Unable to parse response"
							}
						};
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
					message: "Network Error"
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

export default fetch;