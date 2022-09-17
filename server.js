const fs = require('fs');
const async = require('async');
const stream = require('stream');
const express = require('express');
const history = require("connect-history-api-fallback");
const bodyParser = require("body-parser");
const compression = require('compression');
const path = require('path');
const { pipeline } = require('stream');
const { OAuth2Client } = require('google-auth-library');
const webpack = require("webpack");
const middleware = require("webpack-dev-middleware");
const ChipDrive = require("./ChipDrive");

const CLIENT_ID = "580049191997-jk1igosg7ti92lq4kc5s693hbkp8k78g.apps.googleusercontent.com";
const client = new OAuth2Client(CLIENT_ID);

const MAX_STORAGE = 1024 * 1024 * 1024 * 5;

if(!fs.existsSync("database")){
	fs.mkdirSync("database");
}

var queue = async.queue(async (task, executed) => {
	console.log("Task Remaining:  " + queue.length());
	await task();
}, 1);

var app = express();

app.use(compression());
app.use(bodyParser.urlencoded({ extended: false }));
app.use((req, res, next) =>  {
	res.header("Server", "ColdChip");
	res.header("Service-Worker-Allowed", "/");
	console.log(`[${new Date().toUTCString()}] ${req.method.padEnd(6)} ${req.path}`);
	next()
});

app.set('x-powered-by', false);

function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   return result;
}

var accounts = [{
	username: "coldchip", 
	password: "c"
}, {
	username: "a", 
	password: "ab"
}];

var tokens = ["abcdef"];

function auth(req, res, next) {

	var token = req.headers.token ? req.headers.token : req.query.token;

	if(token && tokens.includes(token)) {
		req.user = "internal@chip.sg";
		req.name = "test";
		next();
	} else {
		return res.status(401).json({
			code: 401, 
			message: "Unauthorized"
		});
	}
}

app.get('/api/v2/users/@me', auth, (req, res) => {
	queue.push(async () => {
		res.contentType("application/json");
		res.set('Cache-Control', 'no-store');
			
		return res.status(200).json({
			name: req.name,
			username: req.user
		});
	});
});

app.get('/api/v2/drive/quota', auth, (req, res) => {
	queue.push(async () => {
		res.contentType("application/json");
		res.set('Cache-Control', 'no-store');

		try {
			var cd = new ChipDrive(req.user, null);
			await cd.init();

			var used = await cd.usage();

			var quota = {
				used: used,
				available: MAX_STORAGE
			};

			return res.status(200).json(quota);
		} catch(err) {
			return res.status(500).json({
				code: 500,
				message: "Server Internal Error"
			});
		}
	});
});

app.get('/api/v2/drive/config', auth, (req, res) => {
	queue.push(async () => {
		res.contentType("application/json");
		res.set('Cache-Control', 'no-store');

		let list = [{
			name: "Virtual Drive",
			id: "root"
		}, {
			name: "Shared",
			id: "c37a134e4be06e94840b6082135cb0d1"
		}, {
			name: "Recently Deleted",
			id: "c37a134e4be06e94840b6082135cb0d2"
		}];

		return res.status(200).json(list);
	});
});

app.get('/api/v2/drive/breadcrumb', auth, (req, res) => {
	queue.push(async () => {
		res.contentType("application/json");
		res.set('Cache-Control', 'no-store');


		var id = req.query.id;
		if(id) {
			try {
				var cd = new ChipDrive(req.user, null);
				await cd.init();
				if(await cd.has(id)) {

					var result = [];
					while(await cd.has(id)) {
						var node = await cd.get(id);
						id = node.parent;
						result.unshift({
							name: node.name,
							id: node.id
						});
					}
					
					return res.status(200).json(result);
				} else {
					return res.status(404).json({
						code: 404, 
						message: "Node Not Found"
					});
				}
			} catch(err) {
				return res.status(500).json({
					code: 500,
					message: "Server Internal Error"
				});
			}
		} else {
			return res.status(400).json({
				code: 400, 
				message: "The server can't process the request"
			});
		}
	});
});

app.get('/api/v2/drive/list', auth, (req, res) => {
	queue.push(async () => {
		res.contentType("application/json");
		res.set('Cache-Control', 'no-store');

		var folderid = req.query.folderid;
		var filter = req.query.filter;
		if(folderid) {
			try {
				var cd = new ChipDrive(req.user, null);
				await cd.init();

				if(await cd.isFolder(folderid)) {
					var list = await cd.list(folderid);

					if(filter) {
						list = list.filter((node) => {
							return node.name.toLowerCase().includes(filter.toLowerCase());
						});
					}

					return res.status(200).json(list);
				} else {
					return res.status(404).json({
						code: 404, 
						message: "Node Not Found"
					});
				}
			} catch(err) {
				return res.status(500).json({
					code: 500,
					message: "Server Internal Error"
				});
			}
		} else {
			return res.status(400).json({
				code: 400, 
				message: "The server can't process the request"
			});
		}
	});
});

app.post('/api/v2/drive/file', auth, (req, res) => {
	queue.push(async () => {
		res.contentType("application/json");
		res.set('Cache-Control', 'no-store');

		var folderid = req.body.folderid;
		var name = req.body.name;
		if(folderid && name) {
			try {
				var cd = new ChipDrive(req.user, null);
				await cd.init();
				
				if(await cd.isFolder(folderid)) {
					if((await cd.usage()) <= MAX_STORAGE) {
						var node = await cd.create(folderid, name, ChipDrive.FILE);
						return res.status(201).json(node);
					} else {
						return res.status(413).json({
							code: 413, 
							message: "No storage space left"
						});
					}
				} else {
					return res.status(404).json({
						code: 404, 
						message: "Node Not Found"
					});
				}
			} catch(err) {
				return res.status(500).json({
					code: 500, 
					message: "Server Internal Error"
				});
			}
		} else {
			return res.status(400).json({
				code: 400, 
				message: "The server can't process the request"
			});
		}
	});
});

app.post('/api/v2/drive/folder', auth, (req, res) => {
	queue.push(async () => {
		res.contentType("application/json");
		res.set('Cache-Control', 'no-store');

		var name = req.body.name;
		var folderid = req.body.folderid;
		if(folderid && name) {
			try {
				var cd = new ChipDrive(req.user, null);
				await cd.init();

				if(await cd.isFolder(folderid)) {
					if((await cd.usage()) <= MAX_STORAGE) {
						var node = await cd.create(folderid, name, ChipDrive.FOLDER);
						return res.status(201).json(node);
					} else {
						return res.status(413).json({
							code: 413, 
							message: "No storage space left"
						});
					}
				} else {
					return res.status(404).json({
						code: 404, 
						message: "Node Not Found"
					});
				}
			} catch(err) {
				return res.status(500).json({
					code: 500, 
					message: "Server Internal Error"
				});
			}
		} else {
			return res.status(400).json({
				code: 400, 
				message: "The server can't process the request"
			});
		}
	});
});

app.patch('/api/v2/drive/object/:id', auth, (req, res) => {
	queue.push(async () => {
		res.contentType("application/json");
		res.set('Cache-Control', 'no-store');

		var id = req.params.id;
		var name = req.body.name;
		if(id && name) {
			try {
				var cd = new ChipDrive(req.user, null);
				await cd.init();

				if(await cd.has(id)) {
					await cd.set(id, { name: name });

					return res.status(200).json({});
				} else {
					return res.status(404).json({
						code: 404, 
						message: "Node Not Found"
					});
				}
			} catch(err) {
				return res.status(500).json({
					code: 500, 
					message: "Server Internal Error"
				});
			}
		} else {
			return res.status(400).json({
				code: 400, 
				message: "The server can't process the request"
			});
		}
	});
});

app.delete('/api/v2/drive/object/:id', auth, (req, res) => {
	queue.push(async () => {
		res.contentType("application/json");
		res.set('Cache-Control', 'no-store');

		var id = req.params.id;
		if(id) {
			try {
				var cd = new ChipDrive(req.user, null);
				await cd.init();

				if(await cd.has(id)) {
					await cd.delete(id);

					const params = {
						Bucket: 'chipdrive',
						Key: id
					};

					return res.status(200).json({});
				} else {
					return res.status(404).json({
						code: 404, 
						message: "Node Not Found"
					});
				}
			} catch(err) {
				return res.status(500).json({
					code: 500, 
					message: "Server Internal Error"
				});
			}
		} else {
			return res.status(400).json({
				code: 400, 
				message: "The server can't process the request"
			});
		}
	});
});

app.put('/api/v2/drive/object/:id', auth, async (req, res) => {
	res.contentType("application/json");
	res.set('Cache-Control', 'no-store');

	var id = req.params.id;
	if(id) {
		try {
			var cd = new ChipDrive(req.user, null);
			await cd.init();

			if(await cd.has(id)) {
				if((await cd.usage()) <= MAX_STORAGE) {
					await new Promise((resolve, reject) => {
						pipeline(req, fs.createWriteStream(path.join(__dirname, `/database/${id}`)), (err) => {
							if(!err) {
								resolve();
							} else {
								reject();
							}
						});
					});

					var size = fs.statSync(path.join(__dirname, `/database/${id}`)).size;

					await cd.set(id, { size: size });

					return res.status(200).json({});
				} else {
					return res.status(413).json({
						code: 413, 
						message: "No storage space left"
					});
				}
			} else {
				return res.status(404).json({
					code: 404, 
					message: "Node Not Found"
				});
			}
		} catch(err) {
			return res.status(500).json({
				code: 500, 
				message: "Server Internal Error"
			});
		}
	} else {
		return res.status(400).json({
			code: 400, 
			message: "The server can't process the request"
		});
	}
});

app.get('/api/v2/drive/object/:id', (req, res) => {
	queue.push(async () => {
		res.contentType("application/json");
		res.set('Cache-Control', 'no-store');

		var id = req.params.id;
		if(id) {
			try {
				var cd = new ChipDrive(null, null);
				await cd.init();

				if(await cd.has(id)) {
					res.contentType("application/octet-stream");
					res.sendFile(path.join(__dirname, `./database/${id}`));
				} else {
					return res.status(404).json({
						code: 404, 
						message: "Node Not Found"
					});
				}
			} catch(err) {
				return res.status(500).json({
					code: 500, 
					message: "Server Internal Error"
				});
			}
		} else {
			return res.status(400).json({
				code: 400, 
				message: "The server can't process the request"
			});
		}
	});
});

const compiler = webpack(require("./webpack.config.js"));
app.use(history());
app.use(middleware(compiler, {
	writeToDisk: true
}));

const port = process.env.PORT || 5001;

app.listen(port, () =>  {
	if(process.env.NODE_ENV) {
		console.log("Production Mode is Activated");
	}
    console.log('ChipDrive is running on http://localhost:' + port);
});

