/*
	@title: ChipDrive HTTP API
	@author: Ryan Loh
	@description: A library to perform CRUD requests to ChipDrive server
*/

import $ from './Ajax';

class ChipDrive {
	static SUCCESS_CODE = 1 << 0;
	static FAILURE_CODE = 1 << 1;
	static LOGIN_CODE   = 1 << 2;

	static ACL_READABLE  = 1 << 0;
	static ACL_WRITEABLE = 1 << 1;

	static MSG_RESPONSE_MALFORMED = "Unreadable response from server";
	static MSG_RESPONSE_ERROR = "An error occurred with the server";
	static MSG_RESPONSE_TIMEOUT = "Connection timeout with the server";

	static TIMEOUT = 15000;

	constructor() {
		this.setEndpoint("");
		this.setFolder("");
		this.setACL(0);
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

	setACL(acl) {
		this.acl = acl;
	}

	getACL() {
		return this.acl;
	}

	serialize(array) {
		return array.join("|");
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
					if('object' === typeof res || Object.prototype.toString.call(res) === '[object Array]') {
						if(res["code"] === ChipDrive.SUCCESS_CODE) {
							resolve(res["data"]);
						} else {
							reject(res["reason"]);
						}
					} else {
						reject(ChipDrive.MSG_RESPONSE_MALFORMED);
					}
				},
				error: (e) => {
					if(e.statusText === 'timeout') {
						reject(ChipDrive.MSG_RESPONSE_TIMEOUT);
					} else {
						reject(ChipDrive.MSG_RESPONSE_ERROR);
					}
				},
				timeout: ChipDrive.TIMEOUT
			});
		});
	}

	list() {
		return new Promise((resolve, reject) => {
			$.ajax({
				url: this.getEndpoint() + "/api/v2/drive/list",
				type: "POST",
				data: {
					folderid: this.getFolder(),
					token: this.getToken()
				},
				success: (res) => {
					if('object' === typeof res || Object.prototype.toString.call(res) === '[object Array]') {
						if(res["code"] === ChipDrive.SUCCESS_CODE) {
							resolve(res["data"]);
						} else {
							reject(res["reason"]);
						}
					} else {
						reject(ChipDrive.MSG_RESPONSE_MALFORMED);
					}
				},
				error: (e) => {
					if(e.statusText === 'timeout') {
						reject(ChipDrive.MSG_RESPONSE_TIMEOUT);
					} else {
						reject(ChipDrive.MSG_RESPONSE_ERROR);
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
					if('object' === typeof res || Object.prototype.toString.call(res) === '[object Array]') {
						if(res["code"] === ChipDrive.SUCCESS_CODE) {
							resolve(res["data"]);
						} else {
							reject(res["reason"]);
						}
					} else {
						reject(ChipDrive.MSG_RESPONSE_MALFORMED);
					}
				},
				error: (e) => {
					if(e.statusText === 'timeout') {
						reject(ChipDrive.MSG_RESPONSE_TIMEOUT);
					} else {
						reject(ChipDrive.MSG_RESPONSE_ERROR);
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
					if('object' === typeof res || Object.prototype.toString.call(res) === '[object Array]') {
						if(res["code"] === ChipDrive.SUCCESS_CODE) {
							resolve(res["data"]);
						} else {
							reject(res["reason"]);
						}
					} else {
						reject(ChipDrive.MSG_RESPONSE_MALFORMED);
					}
				},
				error: (e) => {
					if(e.statusText === 'timeout') {
						reject(ChipDrive.MSG_RESPONSE_TIMEOUT);
					} else {
						reject(ChipDrive.MSG_RESPONSE_ERROR);
					}
				},
				timeout: ChipDrive.TIMEOUT
			});
		});
	}

	createHostingFolder(name) {
		return new Promise((resolve, reject) => {
			$.ajax({
				url: this.getEndpoint() + "/api/v2/drive/hostingfolder",
				type: "POST",
				data: {
					folderid: this.getFolder(),
					name: name,
					token: this.getToken()
				},
				success: (res) => {
					if('object' === typeof res || Object.prototype.toString.call(res) === '[object Array]') {
						if(res["code"] === ChipDrive.SUCCESS_CODE) {
							resolve(res["data"]);
						} else {
							reject(res["reason"]);
						}
					} else {
						reject(ChipDrive.MSG_RESPONSE_MALFORMED);
					}
				},
				error: (e) => {
					if(e.statusText === 'timeout') {
						reject(ChipDrive.MSG_RESPONSE_TIMEOUT);
					} else {
						reject(ChipDrive.MSG_RESPONSE_ERROR);
					}
				},
				timeout: ChipDrive.TIMEOUT
			});
		});
	}

	delete(id) {
		return new Promise((resolve, reject) => {
			$.ajax({
				url: this.getEndpoint() + "/api/v2/drive/object/delete",
				type: "POST",
				data: {
					id: id,
					token: this.getToken()
				},
				success: (res) => {
					if('object' === typeof res || Object.prototype.toString.call(res) === '[object Array]') {
						if(res["code"] === ChipDrive.SUCCESS_CODE) {
							resolve(res["data"]);
						} else {
							reject(res["reason"]);
						}
					} else {
						reject(ChipDrive.MSG_RESPONSE_MALFORMED);
					}
				},
				error: (e) => {
					if(e.statusText === 'timeout') {
						reject(ChipDrive.MSG_RESPONSE_TIMEOUT);
					} else {
						reject(ChipDrive.MSG_RESPONSE_ERROR);
					}
				},
				timeout: ChipDrive.TIMEOUT
			});
		});
	}

	rename(id, name) {
		return new Promise((resolve, reject) => {
			$.ajax({
				url: this.getEndpoint() + "/api/v2/drive/object/rename",
				type: "POST",
				data: {
					id: id,
					name: name,
					token: this.getToken()
				},
				success: (res) => {
					if('object' === typeof res || Object.prototype.toString.call(res) === '[object Array]') {
						if(res["code"] === ChipDrive.SUCCESS_CODE) {
							resolve(res["data"]);
						} else {
							reject(res["reason"]);
						}
					} else {
						reject(ChipDrive.MSG_RESPONSE_MALFORMED);
					}
				},
				error: (e) => {
					if(e.statusText === 'timeout') {
						reject(ChipDrive.MSG_RESPONSE_TIMEOUT);
					} else {
						reject(ChipDrive.MSG_RESPONSE_ERROR);
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
					if('object' === typeof res || Object.prototype.toString.call(res) === '[object Array]') {
						if(res["code"] === ChipDrive.SUCCESS_CODE) {
							resolve(res["data"]);
						} else {
							reject(res["reason"]);
						}
					} else {
						reject(ChipDrive.MSG_RESPONSE_MALFORMED);
					}
				},
				error: (e) => {
					if(e.statusText === 'timeout') {
						reject(ChipDrive.MSG_RESPONSE_TIMEOUT);
					} else {
						reject(ChipDrive.MSG_RESPONSE_ERROR);
					}
				},
				cache: false,
	            contentType: "application/octet-stream",
	            processData: false
			});
		});
	}

	itemInfo(id) {
		return new Promise((resolve, reject) => {
			$.ajax({
				url: this.getEndpoint() + "/api/v2/drive/object/info",
				type: "POST",
				data: {
					id: id,
					token: this.getToken()
				},
				success: (res) => {
					if('object' === typeof res || Object.prototype.toString.call(res) === '[object Array]') {
						if(res["code"] === ChipDrive.SUCCESS_CODE) {
							resolve(res["data"]);
						} else {
							reject(res["reason"]);
						}
					} else {
						reject(ChipDrive.MSG_RESPONSE_MALFORMED);
					}
				},
				error: (e) => {
					if(e.statusText === 'timeout') {
						reject(ChipDrive.MSG_RESPONSE_TIMEOUT);
					} else {
						reject(ChipDrive.MSG_RESPONSE_ERROR);
					}
				},
				timeout: ChipDrive.TIMEOUT
			});
		});
	}

	copy(src, dst) {
		return new Promise((resolve, reject) => {
			$.ajax({
				url: this.getEndpoint() + "/api/v2/drive/copy",
				type: "POST",
				data: {
					src: this.serialize(src),
					dst: dst,
					token: this.getToken()
				},
				success: (res) => {
					if('object' === typeof res || Object.prototype.toString.call(res) === '[object Array]') {
						if(res["code"] === ChipDrive.SUCCESS_CODE) {
							resolve(res["data"]);
						} else {
							reject(res["reason"]);
						}
					} else {
						reject(ChipDrive.MSG_RESPONSE_MALFORMED);
					}
				},
				error: (e) => {
					if(e.statusText === 'timeout') {
						reject(ChipDrive.MSG_RESPONSE_TIMEOUT);
					} else {
						reject(ChipDrive.MSG_RESPONSE_ERROR);
					}
				},
				timeout: ChipDrive.TIMEOUT
			});
		});
	}

	cut(src, dst) {
		return new Promise((resolve, reject) => {
			$.ajax({
				url: this.getEndpoint() + "/api/v2/drive/cut",
				type: "POST",
				data: {
					src: this.serialize(src),
					dst: dst,
					token: this.getToken()
				},
				success: (res) => {
					if('object' === typeof res || Object.prototype.toString.call(res) === '[object Array]') {
						if(res["code"] === ChipDrive.SUCCESS_CODE) {
							resolve(res["data"]);
						} else {
							reject(res["reason"]);
						}
					} else {
						reject(ChipDrive.MSG_RESPONSE_MALFORMED);
					}
				},
				error: (e) => {
					if(e.statusText === 'timeout') {
						reject(ChipDrive.MSG_RESPONSE_TIMEOUT);
					} else {
						reject(ChipDrive.MSG_RESPONSE_ERROR);
					}
				},
				timeout: ChipDrive.TIMEOUT
			});
		});
	}

	status() {
		return new Promise((resolve, reject) => {
			$.ajax({
				url: this.getEndpoint() + "/api/v2/drive/status",
				type: "POST",
				data: {
					token: this.getToken()
				},
				success: (res) => {
					if('object' === typeof res || Object.prototype.toString.call(res) === '[object Array]') {
						if(res["code"] === ChipDrive.SUCCESS_CODE) {
							resolve(res["data"]);
						} else {
							reject(res["reason"]);
						}
					} else {
						reject(ChipDrive.MSG_RESPONSE_MALFORMED);
					}
				},
				error: (e) => {
					if(e.statusText === 'timeout') {
						reject(ChipDrive.MSG_RESPONSE_TIMEOUT);
					} else {
						reject(ChipDrive.MSG_RESPONSE_ERROR);
					}
				},
				timeout: ChipDrive.TIMEOUT
			});
		});
	}

	getTextRaw(id) {
		return new Promise((resolve, reject) => {
			$.ajax({
				url: this.getEndpoint() + "/api/v2/drive/object/gettext",
				type: "POST",
				data: {
					id: id,
					token: this.getToken()
				},
				success: (res) => {
					if('object' === typeof res || Object.prototype.toString.call(res) === '[object Array]') {
						if(res["code"] === ChipDrive.SUCCESS_CODE) {
							resolve(res["data"]);
						} else {
							reject(res["reason"]);
						}
					} else {
						reject(ChipDrive.MSG_RESPONSE_MALFORMED);
					}
				},
				error: (e) => {
					if(e.statusText === 'timeout') {
						reject(ChipDrive.MSG_RESPONSE_TIMEOUT);
					} else {
						reject(ChipDrive.MSG_RESPONSE_ERROR);
					}
				},
				timeout: ChipDrive.TIMEOUT
			});
		});
	}

	getSiteSettings(id) {
		return new Promise((resolve, reject) => {
			$.ajax({
				url: this.getEndpoint() + "/api/v2/drive/sitesettings",
				type: "POST",
				data: {
					id: id,
					token: this.getToken()
				},
				success: (res) => {
					if('object' === typeof res || Object.prototype.toString.call(res) === '[object Array]') {
						if(res["code"] === ChipDrive.SUCCESS_CODE) {
							resolve(res["data"]);
						} else {
							reject(res["reason"]);
						}
					} else {
						reject(ChipDrive.MSG_RESPONSE_MALFORMED);
					}
				},
				error: (e) => {
					if(e.statusText === 'timeout') {
						reject(ChipDrive.MSG_RESPONSE_TIMEOUT);
					} else {
						reject(ChipDrive.MSG_RESPONSE_ERROR);
					}
				},
				timeout: ChipDrive.TIMEOUT
			});
		});
	}

	getStreamLink(id) {
		const url = new URL(this.getEndpoint());
		url.pathname = `/api/v2/drive/object/${encodeURI(id)}`;
		url.searchParams.append("token", this.getToken());

		return url.href;
	}

	oauth(token) {
		return new Promise((resolve, reject) => {
			$.ajax({
				url: this.getEndpoint() + "/api/v2/login/oauth",
				type: "POST",
				data: {
					token: this.getToken()
				},
				success: (res) => {
					if('object' === typeof res || Object.prototype.toString.call(res) === '[object Array]') {
						if(res["code"] === ChipDrive.SUCCESS_CODE) {
							resolve(res["data"]);
						} else {
							reject(res["reason"]);
						}
					} else {
						reject(ChipDrive.MSG_RESPONSE_MALFORMED);
					}
				},
				error: (e) => {
					if(e.statusText === 'timeout') {
						reject(ChipDrive.MSG_RESPONSE_TIMEOUT);
					} else {
						reject(ChipDrive.MSG_RESPONSE_ERROR);
					}
				},
				timeout: ChipDrive.TIMEOUT
			});
		});
	}

	loginToken(token) {
		return new Promise((resolve, reject) => {
			$.ajax({
				url: this.getEndpoint() + "/api/v2/oauth",
				type: "POST",
				data: {
					token: token
				},
				success: (res) => {
					if('object' === typeof res || Object.prototype.toString.call(res) === '[object Array]') {
						if(res["code"] === ChipDrive.SUCCESS_CODE) {
							resolve(res["data"]);
						} else {
							reject(res["reason"]);
						}
					} else {
						reject(ChipDrive.MSG_RESPONSE_MALFORMED);
					}
				},
				error: (e) => {
					if(e.statusText === 'timeout') {
						reject(ChipDrive.MSG_RESPONSE_TIMEOUT);
					} else {
						reject(ChipDrive.MSG_RESPONSE_ERROR);
					}
				},
				timeout: ChipDrive.TIMEOUT
			});
		});
	}

	login(username, password) {
		return new Promise((resolve, reject) => {
			$.ajax({
				url: this.getEndpoint() + "/api/v2/login",
				type: "POST",
				data: {
					"username": username,
					"password": password
				},
				success: (res) => {
					if('object' === typeof res || Object.prototype.toString.call(res) === '[object Array]') {
						if(res["code"] === ChipDrive.SUCCESS_CODE) {
							resolve(res["data"]);
						} else {
							reject(res["reason"]);
						}
					} else {
						reject(ChipDrive.MSG_RESPONSE_MALFORMED);
					}
				},
				error: (e) => {
					if(e.statusText === 'timeout') {
						reject(ChipDrive.MSG_RESPONSE_TIMEOUT);
					} else {
						reject(ChipDrive.MSG_RESPONSE_ERROR);
					}
				},
				timeout: ChipDrive.TIMEOUT
			});
		});
	}

	logout(username, password) {
		return new Promise((resolve, reject) => {
			$.ajax({
				url: this.getEndpoint() + "/api/v2/logout",
				type: "POST",
				data: {
					
				},
				success: (res) => {
					if('object' === typeof res || Object.prototype.toString.call(res) === '[object Array]') {
						if(res["code"] === ChipDrive.SUCCESS_CODE) {
							resolve(res["data"]);
						} else {
							reject(res["reason"]);
						}
					} else {
						reject(ChipDrive.MSG_RESPONSE_MALFORMED);
					}
				},
				error: (e) => {
					if(e.statusText === 'timeout') {
						reject(ChipDrive.MSG_RESPONSE_TIMEOUT);
					} else {
						reject(ChipDrive.MSG_RESPONSE_ERROR);
					}
				},
				timeout: ChipDrive.TIMEOUT
			});
		});
	}
}

export default ChipDrive;