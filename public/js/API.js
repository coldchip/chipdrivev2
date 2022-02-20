/*
	@title: ChipDrive HTTP API
	@author: Ryan Loh
	@description: A library to perform CRUD requests to ChipDrive server
*/

import $ from 'jquery';

class ResponseCode {
	static SUCCESS = 1 << 0;
	static ERROR   = 1 << 1;
	static LOGIN   = 1 << 2;
	static code(httpCode) {
		switch(httpCode) {
			case 404:
				return "Item not found or has been deleted"
			case 400:
				return "The server did not understood the request you provided";
			default:
				return "Server sent an unknown error";
		}
	}
}

class ChipDrive {
	static FILE   = 1;
	static FOLDER = 2;
	
	static ACL_READABLE  = 1 << 0;
	static ACL_WRITEABLE = 1 << 1;

	static MSG_RESPONSE_MALFORMED = "Unreadable response from server";
	static MSG_RESPONSE_ERROR = "An error occurred with the server";
	static MSG_RESPONSE_TIMEOUT = "Connection timeout with the server";

	static TIMEOUT = 15000;

	constructor() {
		this.setEndpoint("");
		this.setFolder("");
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

	getDriveList() {
		return new Promise((resolve, reject) => {
			$.ajax({
				url: this.getEndpoint() + "/api/v2/drive/config",
				type: "POST",
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
				type: "POST",
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