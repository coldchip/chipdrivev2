const fs = require('fs');
const async = require('async');
const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const history = require("connect-history-api-fallback");
const bodyParser = require("body-parser");
const compression = require('compression');
const path = require('path');
const { pipeline } = require('stream');
const webpack = require("webpack");
const middleware = require("webpack-dev-middleware");

const ChipDrive = require("./ChipDrive");

if(!fs.existsSync("database")){
	fs.mkdirSync("database");
}

var queue = async.queue(async (task, executed) => {
	console.log("Task Remaining:  " + queue.length());
	await task();
}, 1);

var app = express();

app.use(session({
	name: "chipdrive-session",
	secret: "thereisnospoon",
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
	res.header("strict-transport-security", "max-age=31536000; includeSubDomains");
	res.header("x-content-type-options", "nosniff");
	res.header("x-frame-options", "DENY");
	res.header("x-xss-protection", "1; mode=block");
	res.header("Server", "ColdChip");
	console.log(`[${new Date().toUTCString()}] ${req.method.padEnd(6)} ${req.path}`);
	next();
});

app.set('x-powered-by', false);

function auth(req, res, next) {
	var user = req.session.user;
	if(user) {
		req.user = user;
		next();
	} else {
		return res.status(401).json({
			code: 401, 
			message: "Unauthorized"
		});
	}
}

app.post('/api/v2/login', (req, res) => {
	setTimeout(() => {
		queue.push(async () => {
			res.contentType("application/json");
			res.set('Cache-Control', 'no-store');

			var username = req.body.username;
			var password = req.body.password;

			if(username === "a45nUXq8QGnSyHZ8GrRryQZqvMStBWPD" && password === "a45nUXq8QGnSyHZ8GrRryQZqvMStBWPD") {
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

app.get('/api/v2/logout', auth, (req, res) => {
	queue.push(async () => {
		res.contentType("application/json");
		res.set('Cache-Control', 'no-store');

		req.session.destroy();

		return res.status(200).json({});
	});
});

app.get('/api/v2/drive/version', auth, (req, res) => {
	queue.push(async () => {
		res.contentType("application/json");
		res.set('Cache-Control', 'no-store');

		return res.status(200).json({version: "v1.0.0"});
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
					var node = await cd.create(folderid, name, ChipDrive.FILE);
					return res.status(201).json(node);
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
					var node = await cd.create(folderid, name, ChipDrive.FOLDER);
					return res.status(201).json(node);
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
					await cd.rename(id, name);
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

app.put('/api/v2/drive/object/:id', auth, (req, res) => {
	queue.push(async () => {
		res.contentType("application/json");
		res.set('Cache-Control', 'no-store');

		var id = req.params.id;
		if(id) {
			try {
				var cd = new ChipDrive(req.user, null);
				await cd.init();

				if(await cd.has(id)) {
					pipeline(req, fs.createWriteStream(path.join(__dirname, `/database/${id}`)), (err) => {
						if(!err) {
							return res.status(200).json({});
						} else {
							return res.status(500).json({
								code: 500, 
								message: "Piping to backend failed"
							});
						}
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
});

app.get('/api/v2/drive/object/:id', auth, (req, res) => {
	queue.push(async () => {
		res.contentType("application/json");
		res.set('Cache-Control', 'no-store');

		var id = req.params.id;
		if(id) {
			try {
				var cd = new ChipDrive(req.user, null);
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

