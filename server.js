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
const AWS = require('aws-sdk');

const s3 = new AWS.S3({
	accessKeyId: process.env.BUCKETKEY,
	secretAccessKey: process.env.BUCKETTOKEN,
	region: "ap-southeast-1"
});

const CLIENT_ID = "580049191997-jk1igosg7ti92lq4kc5s693hbkp8k78g.apps.googleusercontent.com";
const client = new OAuth2Client(CLIENT_ID);

const MAX_STORAGE = 1024 * 1024 * 500;

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

					await s3.deleteObject(params).promise();

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

					var passthrough = new stream.PassThrough();

					const params = {
						Bucket: 'chipdrive',
						Key: id,
						Body: passthrough
					};

					var s3upload = await s3.upload(params).promise();

					pipeline(req, passthrough, (err) => {
						console.log(err);
						if(!err) {
							return res.status(200).json({});
						} else {
							s3upload.abort();
							return res.status(500).json({
								code: 500, 
								message: "Pipe error"
							});
						}
					});

					//await cd.set(id, { size: size });

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
	res.contentType("application/json");
	res.set('Cache-Control', 'no-store');

	var id = req.params.id;
	if(id) {
		try {
			var cd = new ChipDrive(req.user, null);
			await cd.init();

			if(await cd.has(id)) {
				res.contentType("application/octet-stream");

				var params = {
					Bucket: 'chipdrive',
					Key: id,
					Range: req.headers.range
				};

				var s3object = s3.getObject(params);

				req
				.on("close", () => s3object.abort());

				s3object
				.on('httpHeaders', (status, headers, response) => {
					res.status(status);

					if(headers["accept-ranges"]) {
						res.set("accept-ranges", headers["accept-ranges"]);
					}
					if(headers["content-range"]) {
						res.set("content-range", headers["content-range"]);
					}
					if(headers["content-length"]) {
						res.set("content-length", headers["content-length"]);
					}
					response.httpResponse.createUnbufferedStream().pipe(res);
				})
				.on('error', () => {
					return res.status(500).json({
						code: 500, 
						message: "Backend data fetch failed"
					});
				})
				.send();
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

