/*
	@title: ChipDrive HTTP API
	@author: Ryan Loh
	@description: A library to perform CRUD requests to ChipDrive server
*/

import $ from 'jquery';

class ResponseCode {
	static code(httpCode) {
		switch(httpCode) {
			case 400:
				return "The server did not understood the request you provided";
			case 401:
				return "Unauthorized request to the server";
			case 404:
				return "Item not found or has been deleted"
			case 500:
				return "Unknown error occurred with the server"
			default:
				return "Server sent an unknown error";
		}
	}
}

class ChipDrive {
	static FILE   = 1;
	static FOLDER = 2;

	static MSG_RESPONSE_TIMEOUT = "Connection timeout with the server";

	static TIMEOUT = 15000;

	constructor() {
		console.log(`%cChip%cDrive %cClient`, 'color: #43833a; font-size: 30px;', 'color: #a5a5a5; font-size: 30px;', 'color: #4d4d4d; font-size: 30px;');
		ChipDrive.log("Unless you are a developer, please do not type or insert anything here if someone asks you to do it. It might be malicious. Your data may be compromised if you do so. ");

		this.setEndpoint("");
		this.setFolder("");
		this.callbacks = {
			login: () => {}
		}
	}

	static log(text) {
		console.log(`%cChipDrive • Log:%c ${text}`, 'color: #FFFFFF; background: #43833a;', 'color: #4D4D4D;');
	}

	static error(text) {
		console.log(`%cChipDrive • Error:%c ${text}`, 'color: #FFFFFF; background: red;', 'color: #4D4D4D;');
		throw new Error(text);
	}

	setToken(token) {
		this.token = token;
	}

	getToken() {
		return this.token;
	}

	setEndpoint(host) {
		this.endpoint = host;
	}

	getEndpoint() {
		return this.endpoint;
	}

	setFolder(id) {
		this.folder = id;
	}

	getFolder() {
		return this.folder;
	}

	on(type, callback) {
		switch(type) {
			case "login":
				this.callbacks.login = callback;
			break;
			default:
				ChipDrive.error("Unable to set unknown callback type when setting .on() listener");
			break;
		}
	}

	login(username, password) {
		return new Promise((resolve, reject) => {
			$.ajax({
				url: this.getEndpoint() + "/api/v2/login",
				type: "POST",
				data: {
					username: username,
					password: password,
					token: this.getToken()
				},
				success: (res) => {
					resolve(res);
				},
				error: (e) => {
					if(e.statusText === 'timeout') {
						reject(ChipDrive.MSG_RESPONSE_TIMEOUT);
					} else {
						if(401 === e.status) {
							this.callbacks.login();
						}
						reject(ResponseCode.code(e.status));
					}
				},
				timeout: ChipDrive.TIMEOUT
			});
		});
	}

	getDriveList() {
		return new Promise((resolve, reject) => {
			$.ajax({
				url: this.getEndpoint() + "/api/v2/drive/config",
				type: "GET",
				data: {
					token: this.getToken()
				},
				success: (res) => {
					resolve(res);
				},
				error: (e) => {
					if(e.statusText === 'timeout') {
						reject(ChipDrive.MSG_RESPONSE_TIMEOUT);
					} else {
						if(401 === e.status) {
							this.callbacks.login();
						}
						reject(ResponseCode.code(e.status));
					}
				},
				timeout: ChipDrive.TIMEOUT
			});
		});
	}

	list(filter) {
		return new Promise((resolve, reject) => {
			$.ajax({
				url: this.getEndpoint() + "/api/v2/drive/list",
				type: "GET",
				data: {
					folderid: this.getFolder(),
					filter: filter,
					token: this.getToken()
				},
				success: (res) => {
					resolve(res);
				},
				error: (e) => {
					if(e.statusText === 'timeout') {
						reject(ChipDrive.MSG_RESPONSE_TIMEOUT);
					} else {
						if(401 === e.status) {
							this.callbacks.login();
						}
						reject(ResponseCode.code(e.status));
					}
				},
				timeout: ChipDrive.TIMEOUT
			});
		});
	}

	createFile(name) {
		return new Promise((resolve, reject) => {
			$.ajax({
				url: this.getEndpoint() + "/api/v2/drive/file",
				type: "POST",
				data: {
					folderid: this.getFolder(),
					name: name,
					token: this.getToken()
				},
				success: (res) => {
					resolve(res);
				},
				error: (e) => {
					if(e.statusText === 'timeout') {
						reject(ChipDrive.MSG_RESPONSE_TIMEOUT);
					} else {
						if(401 === e.status) {
							this.callbacks.login();
						}
						reject(ResponseCode.code(e.status));
					}
				},
				timeout: ChipDrive.TIMEOUT
			});
		});
	}

	createFolder(name) {
		return new Promise((resolve, reject) => {
			$.ajax({
				url: this.getEndpoint() + "/api/v2/drive/folder",
				type: "POST",
				data: {
					folderid: this.getFolder(),
					name: name,
					token: this.getToken()
				},
				success: (res) => {
					resolve(res);
				},
				error: (e) => {
					if(e.statusText === 'timeout') {
						reject(ChipDrive.MSG_RESPONSE_TIMEOUT);
					} else {
						if(401 === e.status) {
							this.callbacks.login();
						}
						reject(ResponseCode.code(e.status));
					}
				},
				timeout: ChipDrive.TIMEOUT
			});
		});
	}

	delete(id) {
		return new Promise((resolve, reject) => {
			$.ajax({
				url: this.getStreamLink(id),
				type: "DELETE",
				data: {
					token: this.getToken()
				},
				success: (res) => {
					resolve(res);
				},
				error: (e) => {
					if(e.statusText === 'timeout') {
						reject(ChipDrive.MSG_RESPONSE_TIMEOUT);
					} else {
						if(401 === e.status) {
							this.callbacks.login();
						}
						reject(ResponseCode.code(e.status));
					}
				},
				timeout: ChipDrive.TIMEOUT
			});
		});
	}

	rename(id, name) {
		return new Promise((resolve, reject) => {
			$.ajax({
				url: this.getStreamLink(id),
				type: "PATCH",
				data: {
					name: name,
					token: this.getToken()
				},
				success: (res) => {
					resolve(res);
				},
				error: (e) => {
					if(e.statusText === 'timeout') {
						reject(ChipDrive.MSG_RESPONSE_TIMEOUT);
					} else {
						if(401 === e.status) {
							this.callbacks.login();
						}
						reject(ResponseCode.code(e.status));
					}
				},
				timeout: ChipDrive.TIMEOUT
			});
		});
	}

	put(file, id, progress) {
		return new Promise((resolve, reject) => {
			$.ajax({
				xhr: () => {
					var xhr = new window.XMLHttpRequest();
					if(progress) {
						xhr.upload.addEventListener("progress", function(evt) {
							if (evt.lengthComputable) {
								progress((evt.loaded / evt.total) * 100);
							}
						}, false);
					}
					return xhr;
				},
				url: this.getStreamLink(id),
				type: "PUT",
				data: file,
				success: (res) => {
					resolve(res);
				},
				error: (e) => {
					if(e.statusText === 'timeout') {
						reject(ChipDrive.MSG_RESPONSE_TIMEOUT);
					} else {
						if(401 === e.status) {
							this.callbacks.login();
						}
						reject(ResponseCode.code(e.status));
					}
				},
				cache: false,
	            contentType: "application/octet-stream",
	            processData: false
			});
		});
	}

	getStreamLink(id) {
		const url = new URL(window.location.href.split('?')[0]);
		url.pathname = `/api/v2/drive/object/${encodeURI(id)}`;
		url.searchParams.append("token", this.getToken());

		return url.href;
	}
}

export default ChipDrive;