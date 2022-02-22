/*
	@title: ChipDrive HTTP API
	@author: Ryan Loh
	@description: A library to perform CRUD requests to ChipDrive server
*/

class ChipDrive {
	static TIMEOUT = 15000;

	static log(text) {
		console.log(`%cChipDrive • Log:%c ${text}`, 'color: #FFFFFF; background: #43833a;', 'color: #4D4D4D;');
	}

	static error(text) {
		console.log(`%cChipDrive • Error:%c ${text}`, 'color: #FFFFFF; background: red;', 'color: #4D4D4D;');
		throw new Error(text);
	}

	static get(url, query) {
		return new Promise((resolve, reject) => {
			var xhr = new XMLHttpRequest();
			xhr.open('GET', `${url}?${new URLSearchParams(query).toString()}`, true);

			xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

			xhr.onreadystatechange = function() {
				if(xhr.readyState == 4) {
					var json = JSON.parse(xhr.responseText);
					var type = Math.floor(xhr.status / 100);

					if(type == 2) {
						var response = {
							status: xhr.status,
							body: json
						};
						resolve(response);
					} else {
						var response = {
							status: xhr.status,
							body: json
						};
						reject(response);
					}
				}
			}

			xhr.timeout = ChipDrive.TIMEOUT;

			xhr.send(null);
		});
	}

	static post(url, body) {
		return new Promise((resolve, reject) => {
			var xhr = new XMLHttpRequest();
			xhr.open('POST', url, true);

			xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

			xhr.onreadystatechange = function() {
				if(xhr.readyState == 4) {
					var json = JSON.parse(xhr.responseText);
					var type = Math.floor(xhr.status / 100);

					if(type == 2) {
						var response = {
							status: xhr.status,
							body: json
						};
						resolve(response);
					} else {
						var response = {
							status: xhr.status,
							body: json
						};
						reject(response);
					}
				}
			}

			xhr.timeout = ChipDrive.TIMEOUT;

			xhr.send(new URLSearchParams(body).toString());
		});
	}

	static put(url, blob, progress) {
		return new Promise((resolve, reject) => {
			var xhr = new XMLHttpRequest();
			xhr.open('PUT', url, true);

			xhr.setRequestHeader('Content-type', 'application/octet-stream');

			xhr.upload.onprogress = (event) => {
				if (event.lengthComputable) {
					progress((event.loaded / event.total) * 100);
				}
			}

			xhr.onreadystatechange = function() {
				if(xhr.readyState == 4) {
					var json = JSON.parse(xhr.responseText);
					var type = Math.floor(xhr.status / 100);

					if(type == 2) {
						var response = {
							status: xhr.status,
							body: json
						};
						resolve(response);
					} else {
						var response = {
							status: xhr.status,
							body: json
						};
						reject(response);
					}
				}
			}
			xhr.send(blob);
		});
	}

	static patch(url, body) {
		return new Promise((resolve, reject) => {
			var xhr = new XMLHttpRequest();
			xhr.open('PATCH', url, true);

			xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

			xhr.onreadystatechange = function() {
				if(xhr.readyState == 4) {
					var json = JSON.parse(xhr.responseText);
					var type = Math.floor(xhr.status / 100);

					if(type == 2) {
						var response = {
							status: xhr.status,
							body: json
						};
						resolve(response);
					} else {
						var response = {
							status: xhr.status,
							body: json
						};
						reject(response);
					}
				}
			}

			xhr.timeout = ChipDrive.TIMEOUT;

			xhr.send(new URLSearchParams(body).toString());
		});
	}

	static delete(url) {
		return new Promise((resolve, reject) => {
			var xhr = new XMLHttpRequest();
			xhr.open('DELETE', url, true);

			xhr.onreadystatechange = function() {
				if(xhr.readyState == 4) {
					var json = JSON.parse(xhr.responseText);
					var type = Math.floor(xhr.status / 100);

					if(type == 2) {
						var response = {
							status: xhr.status,
							body: json
						};
						resolve(response);
					} else {
						var response = {
							status: xhr.status,
							body: json
						};
						reject(response);
					}
				}
			}

			xhr.timeout = ChipDrive.TIMEOUT;

			xhr.send(null);
		});
	}

	static getObjectURL(id) {
		const url = new URL(window.location.href.split('?')[0]);
		url.pathname = `/api/v2/drive/object/${encodeURI(id)}`;

		return url.href;
	}
}

export default ChipDrive;