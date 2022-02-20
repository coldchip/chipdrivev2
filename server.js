const fs = require('fs');
const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const bodyParser = require("body-parser");
const compression = require('compression');
const path = require('path');
const { pipeline } = require('stream');
const webpack = require("webpack");
const middleware = require("webpack-dev-middleware");

const ResponseCode = require("./ResponseCode");
const ChipDrive = require("./ChipDrive");
const Queue = require("./Queue");

if(!fs.existsSync("database")){
	fs.mkdirSync("database");
}

var queue = new Queue();

var app = express();

const compiler = webpack(require("./webpack.config.js"));
app.use(
	middleware(compiler, {
		writeToDisk: true
	})
);
app.use(compression());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use((req, res, next) =>  {
	res.header("strict-transport-security", "max-age=31536000; includeSubDomains");
	res.header("x-content-type-options", "nosniff");
	res.header("x-frame-options", "DENY");
	res.header("x-xss-protection", "1; mode=block");
	res.header("Server", "ColdChip");
	console.log(`[${new Date().toUTCString()}] ${req.method.padEnd(6)} ${req.path}`);
	next();
});

var db = [{"name": "", "id": "root", "parent": "?"}];

function validate(token) {
	return true;
}

app.post('/api/v2/drive/config', function(req, res) {
	res.contentType("application/json");
	res.set('Cache-Control', 'no-store');

	var token = req.query.token || req.body.token;

	if(validate(token)) {
		setTimeout(() => {
			let list = [{
				"name": "Virtual Drive",
				"id": "root"
			}, {
				"name": "Shared",
				"id": "c37a134e4be06e94840b6082135cb0d1"
			}, {
				"name": "Recently Deleted",
				"id": "c37a134e4be06e94840b6082135cb0d2"
			}];
			res.send({
				code: ResponseCode.SUCCESS,
				reason: "",
				data: list
			});
		}, 600);
	} else {
		// res.status(401)
		res.send({
			code: ResponseCode.LOGIN,
			reason: "Please provide a proper authentication token"
		});
	}
});

app.post('/api/v2/drive/list', function(req, res) {
	res.contentType("application/json");
	res.set('Cache-Control', 'no-store');

	var token = req.query.token || req.body.token;

	if(validate(token)) {
		var folderid = req.body.folderid;
		var filter = req.body.filter;
		if(folderid) {
			queue.enqueue(async (done) => {
				try {
					var cd = new ChipDrive(token, db);

					await cd.init();
					var list = await cd.list(folderid);

					if(filter) {
						list = list.filter((node) => {
							return node.name.toLowerCase().includes(filter.toLowerCase());
						});
					} 
					
					res.send({
						code: ResponseCode.SUCCESS,
						reason: "",
						data: list
					});
				} catch(err) {
					res.send({
						code: ResponseCode.ERROR,
						reason: err
					});
				} finally {
					done();
				}
			});
		} else {
			res.send({
				code: ResponseCode.ERROR,
				reason: "Unable to fulfill params"
			});
		}
	} else {
		res.send({
			code: ResponseCode.LOGIN,
			reason: "Please provide a proper authentication token"
		});
	}
});

app.post('/api/v2/drive/file', function(req, res) {
	res.contentType("application/json");
	res.set('Cache-Control', 'no-store');

	var token = req.query.token || req.body.token;

	if(validate(token)) {
		var folderid = req.body.folderid;
		var name = req.body.name;
		if(folderid && name) {
			queue.enqueue(async (done) => {
				try {
					var cd = new ChipDrive(token, db);

					await cd.init();

					var node = await cd.create(folderid, name, ChipDrive.FILE);

					res.send({
						code: ResponseCode.SUCCESS,
						reason: "",
						data: node
					});
				} catch(err) {
					res.send({
						code: ResponseCode.ERROR,
						reason: err
					});
				} finally {
					done();
				}
			});
		} else {
			res.send({
				code: ResponseCode.ERROR,
				reason: "Unable to fulfill params"
			});
		}
	} else {
		res.send({
			code: ResponseCode.LOGIN,
			reason: "Please provide a proper authentication token"
		});
	}
});

app.post('/api/v2/drive/folder', function(req, res) {
	res.contentType("application/json");
	res.set('Cache-Control', 'no-store');

	var token = req.query.token || req.body.token;

	if(validate(token)) {
		var name = req.body.name;
		var folderid = req.body.folderid;
		if(name && folderid) {
			queue.enqueue(async (done) => {
				try {
					var cd = new ChipDrive(token, db);

					await cd.init();

					var node = await cd.create(folderid, name, ChipDrive.FOLDER);

					res.send({
						code: ResponseCode.SUCCESS,
						reason: "",
						data: node
					});
				} catch(err) {
					res.send({
						code: ResponseCode.ERROR,
						reason: err
					});
				} finally {
					done();
				}
			});
		} else {
			res.send({
				code: ResponseCode.ERROR,
				reason: "Unable to fulfill params"
			});
		}
	} else {
		res.send({
			code: ResponseCode.LOGIN,
			reason: "Please provide a proper authentication token"
		});
	}
});

app.post('/api/v2/drive/object/rename', function(req, res) {
	res.contentType("application/json");
	res.set('Cache-Control', 'no-store');

	var token = req.query.token || req.body.token;

	if(validate(token)) {
		var id = req.body.id;
		var name = req.body.name;
		if(id && name) {
			queue.enqueue(async (done) => {
				try {
					var cd = new ChipDrive(token, db);

					await cd.init();

					await cd.rename(id, name);

					res.send({
						code: ResponseCode.SUCCESS,
						reason: ""
					});
				} catch(err) {
					res.send({
						code: ResponseCode.ERROR,
						reason: err
					});
				} finally {
					done();
				}
			});
		} else {
			res.send({
				code: ResponseCode.ERROR,
				reason: "Unable to fulfill params"
			});
		}
	} else {
		res.send({
			code: ResponseCode.LOGIN,
			reason: "Please provide a proper authentication token"
		});
	}
});

app.post('/api/v2/drive/object/delete', function(req, res) {
	res.contentType("application/json");
	res.set('Cache-Control', 'no-store');

	var token = req.query.token || req.body.token;

	if(validate(token)) {
		var id = req.body.id;
		if(id) {
			queue.enqueue(async (done) => {
				try {
					var cd = new ChipDrive(token, db);

					await cd.init();

					await cd.delete(id);

					res.send({
						code: ResponseCode.SUCCESS,
						reason: ""
					});
				} catch(err) {
					res.send({
						code: ResponseCode.ERROR,
						reason: err
					});
				} finally {
					done();
				}
			});
		} else {
			res.send({
				code: ResponseCode.ERROR,
				reason: "Unable to fulfill params"
			});
		}
	} else {
		res.send({
			code: ResponseCode.LOGIN,
			reason: "Please provide a proper authentication token"
		});
	}
});

app.put('/api/v2/drive/object/:id', async function(req, res) {
	res.contentType("application/json");
	res.set('Cache-Control', 'no-store');

	var token = req.query.token || req.body.token;

	if(validate(token)) {
		var id = req.params.id;
		if(id) {
			try {
				var cd = new ChipDrive(token, db);

				await cd.init();

				if(await cd.has(id)) {
					pipeline(req, fs.createWriteStream(path.join(__dirname, `/database/${id}`)), (err) => {
						if(!err) {
							res.send({
								code: ResponseCode.SUCCESS,
								reason: ""
							});
						} else {
							throw "Upload error";
						}
					});
				} else {
					throw "Unauthorized to access content";
				}
			} catch(err) {
				res.send({
					code: ResponseCode.ERROR,
					reason: err
				});
			}
		} else {
			res.send({
				code: ResponseCode.ERROR,
				reason: "Unable to fulfill params"
			});
		}
	} else {
		res.send({
			code: ResponseCode.LOGIN,
			reason: "Please provide a proper authentication token"
		});
	}
});

app.get('/api/v2/drive/object/:id', async function(req, res) {
	res.contentType("application/json");
	res.set('Cache-Control', 'no-store');

	var token = req.query.token || req.body.token;

	if(validate(token)) {
		var id = req.params.id;
		if(id) {
			try {
				var cd = new ChipDrive(token, db);

				await cd.init();

				if(await cd.has(id)) {
					res.contentType("application/octet-stream");
					res.set('Cache-Control', 'no-store');
					res.sendFile(path.join(__dirname, `./database/${id}`));
				} else {
					throw "Unauthorized to access content";
				}
			} catch(err) {
				res.send({
					code: ResponseCode.ERROR,
					reason: err
				});
			}
		} else {
			res.send({
				code: ResponseCode.ERROR,
				reason: "Unable to fulfill params"
			});
		}
	} else {
		res.send({
			code: ResponseCode.LOGIN,
			reason: "Please provide a proper authentication token"
		});
	}
});

app.set('x-powered-by', false);

const port = process.env.PORT || 5001;

app.listen(port, () =>  {
	if(process.env.NODE_ENV) {
		console.log("Production Mode is Activated");
	}
    console.log('ChipDrive is running on http://localhost:' + port);
});

queue.run();