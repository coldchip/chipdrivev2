const fs = require('fs');
const async = require('async');
const stream = require('stream');
const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const history = require("connect-history-api-fallback");
const bodyParser = require("body-parser");
const compression = require('compression');
const path = require('path');
const { pipeline } = require('stream');
const { OAuth2Client } = require('google-auth-library');
const webpack = require("webpack");
const middleware = require("webpack-dev-middleware");
const ChipDrive = require("./ChipDrive");
const http = require('http');

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

const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.use(session({
	name: "chipdrive-session",
	secret: "hteh4tgrgt4ttgrdfesfnyjthrawefds",
	resave: false,
	saveUninitialized: true,
	cookie: {
		expires: 1000 * 60 * 60 * 24
	}
}));
app.use(compression());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use((req, res, next) =>  {
	// res.header("strict-transport-security", "max-age=31536000; includeSubDomains");
	// res.header("x-content-type-options", "nosniff");
	// res.header("x-frame-options", "DENY");
	// res.header("x-xss-protection", "1; mode=block");
	res.header("Server", "ColdChip");
	res.header("Service-Worker-Allowed", "/");
	console.log(`[${new Date().toUTCString()}] ${req.method.padEnd(6)} ${req.path}`);
	next();
});

app.set('x-powered-by', false);

function auth(req, res, next) {
	var user = req.session.user;
	var name = req.session.name;
	if(user) {
		req.user = user;
		req.name = name;
		next();
	} else {
		return res.status(401).json({
			code: 401, 
			message: "Unauthorized"
		});
	}
}

var accounts = [{
	username: "coldchip", 
	password: "c"
}, {
	username: "a", 
	password: "ab"
}];

function validate(username, password) {
	if(process.env.username && process.env.password) {
		return (username === process.env.username && password === process.env.password);
	} else {
		for(const account of accounts) {
			if(account.username === username && account.password === password) {
				return true;
			}
		}

		return false;
	}
}

app.post('/api/v2/auth/login', (req, res) => {
	setTimeout(() => {
		queue.push(async () => {
			res.contentType("application/json");
			res.set('Cache-Control', 'no-store');

			var username = req.body.username;
			var password = req.body.password;

			if(validate(username, password)) {
				
				req.session.user = username;

				return res.status(200).json({});
			} else {
				return res.status(400).json({
					code: 400,
					message: "Invalid credentials"
				});
			}
		});
	}, 1000);
});

app.post('/api/v2/oauth/login', (req, res) => {
	queue.push(async () => {
		res.contentType("application/json");
		res.set('Cache-Control', 'no-store');

		var token = req.body.token;

		try {
			const ticket = await client.verifyIdToken({
				idToken: token,
				audience: CLIENT_ID,
			});
			const {email, name} = ticket.getPayload();

			console.log(ticket.getPayload());

			if(email && name) {
				req.session.user = email;
				req.session.name = name;
				return res.status(200).json({});
			} else {
				return res.status(400).json({
					code: 400,
					message: "Invalid OAuth Token"
				});
			}
		} catch(e) {
			console.log(e);
			return res.status(500).json({
				code: 500,
				message: "Server Internal Error"
			});
		}
	});
});

app.get('/api/v2/auth/logout', auth, (req, res) => {
	queue.push(async () => {
		res.contentType("application/json");
		res.set('Cache-Control', 'no-store');

		req.session.destroy();

		return res.status(200).json({});
	});
});

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

		// await new Promise((resolve, reject) => {
		// 	setTimeout(() => {resolve()}, 10000);
		// });

		return res.status(200).json(list);
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
			console.log(err);
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

app.put('/api/v2/drive/object/:id/:start', auth, async (req, res) => {
	res.contentType("application/json");
	res.set('Cache-Control', 'no-store');

	var id = req.params.id;
	var start = req.params.start;
	if(id && start) {
		try {
			var cd = new ChipDrive(req.user, null);
			await cd.init();

			if(await cd.has(id)) {
				if((await cd.usage()) <= MAX_STORAGE) {

					start = parseInt(start, 10);

					await new Promise((resolve, reject) => {
						pipeline(req, fs.createWriteStream(path.join(__dirname, `/database/${id}`), {
							flags: "a",
							start: start
						}), (err) => {
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
			console.log(err);
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

app.get('/api/v2/drive/object/:id', auth, async (req, res) => {
	res.set('Cache-Control', 'no-store');

	var id = req.params.id;
	if(id) {
		try {
			var cd = new ChipDrive(req.user, null);
			await cd.init();

			if(await cd.has(id)) {
				res.contentType("application/octet-stream");

				var filename = path.join(__dirname, `./database/${id}`);

				res.sendFile(filename);
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

app.get('/api/v2/drive/object/:id/:start/:end', auth, async (req, res) => {
	res.set('Cache-Control', 'no-store');

	var id = req.params.id;
	var start = req.params.start;
	var end = req.params.end;
	if(id && start && end) {
		try {
			var cd = new ChipDrive(req.user, null);
			await cd.init();

			if(await cd.has(id)) {
				res.contentType("application/octet-stream");

				var filename = path.join(__dirname, `./database/${id}`);

				var stats = fs.statSync(filename);
				var size = stats.size;

				start = start ? parseInt(start, 10) : 0;
				end = end ? parseInt(end, 10) : start + CHUNK_SIZE;

				end = Math.min(end, size - 1);

				res.set({
					"Content-Length": (end - start) + 1,
					"Total-Size": size
				});

				pipeline(fs.createReadStream(filename, {
					start: start, 
					end: end
				}), res, (err) => {

				});
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



io.on("connection", function (socket) {
	console.log("Made socket connection");

	socket.on("stream", async (data) => {
		console.log(data);

		var {id, start, end} = data;

		var cd = new ChipDrive("ryan@coldchip.ru", null);
		await cd.init();

		if(await cd.has(id)) {
			var filename = path.join(__dirname, `./database/${id}`);

			if(!end) {
				end = start + 128;
			}

			var stream = fs.createReadStream(filename, {
				start: start, 
				end: end
			})

			const _buf = [];

			await new Promise((resolve, reject) => {

				stream.on("data", (chunk) => _buf.push(chunk));
				stream.on("end", () => resolve(Buffer.concat(_buf)));
				stream.on("error", (err) => reject(err));

			});

			console.log(_buf);

			socket.emit("chunk", new Uint8Array(new ArrayBuffer(_buf)));
		}
	});

	socket.on("disconnect", () => {

	});
});

const compiler = webpack(require("./webpack.config.js"));
app.use(history());
app.use(middleware(compiler, {
	writeToDisk: true
}));

const port = process.env.PORT || 5001;

server.listen(port, () =>  {
	if(process.env.NODE_ENV) {
		console.log("Production Mode is Activated");
	}
    console.log('ChipDrive is running on http://localhost:' + port);
});

