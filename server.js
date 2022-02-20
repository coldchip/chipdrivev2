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

function auth(req, res, next) {
	var token = req.query.token || req.body.token;
	req.token = token;
	next();
}

app.post('/api/v2/drive/config', auth, function(req, res) {
	res.contentType("application/json");
	res.set('Cache-Control', 'no-store');

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
		res.json(list);
	}, 600);
});

app.post('/api/v2/drive/list', auth, async function(req, res) {
	try {
		res.contentType("application/json");
		res.set('Cache-Control', 'no-store');

		var folderid = req.body.folderid;
		var filter = req.body.filter;

		if(!folderid) {
			res.status(400);
			throw "Unable to fulfill params";
		}

		var cd = new ChipDrive(req.token, null);

		await cd.init();

		if(!(await cd.has(folderid))) {
			res.status(404);
			throw "Item not found";
		}

		var list = await cd.list(folderid);

		if(filter) {
			list = list.filter((node) => {
				return node.name.toLowerCase().includes(filter.toLowerCase());
			});
		}

		res.json(list);
	} catch(err) {
		res.json({
			code: 0,
			message: err
		});
	}
});

app.post('/api/v2/drive/file', auth, async function(req, res) {
	try {
		res.contentType("application/json");
		res.set('Cache-Control', 'no-store');

		var folderid = req.body.folderid;
		var name = req.body.name;

		if(!folderid || !name) {
			res.status(400);
			throw "Unable to fulfill params";
		}

		var cd = new ChipDrive(req.token, null);

		await cd.init();

		if(!(await cd.has(folderid))) {
			res.status(404);
			throw "Item not found";
		}

		var node = await cd.create(folderid, name, ChipDrive.FILE);

		res.status(201);
		res.json(node);
	} catch(err) {
		res.json({
			code: 0,
			message: err
		});
	}
});

app.post('/api/v2/drive/folder', auth, async function(req, res) {
	try {
		res.contentType("application/json");
		res.set('Cache-Control', 'no-store');

		var name = req.body.name;
		var folderid = req.body.folderid;

		if(!folderid || !name) {
			res.status(400);
			throw "Unable to fulfill params";
		}

		var cd = new ChipDrive(req.token, null);

		await cd.init();

		if(!(await cd.has(folderid))) {
			res.status(404);
			throw "Item not found";
		}

		var node = await cd.create(folderid, name, ChipDrive.FOLDER);

		res.status(201);
		res.json(node);
	} catch(err) {
		res.json({
			code: 0,
			message: err
		});
	}
});

app.patch('/api/v2/drive/object/:id', auth, async function(req, res) {
	try {
		res.contentType("application/json");
		res.set('Cache-Control', 'no-store');

		var id = req.params.id;
		var name = req.body.name;

		if(!id || !name) {
			res.status(400);
			throw "Unable to fulfill params";
		}

		var cd = new ChipDrive(req.token, null);

		await cd.init();

		if(!(await cd.has(id))) {
			res.status(404);
			throw "Item not found";
		}

		await cd.rename(id, name);

		res.json({});
	} catch(err) {
		res.json({
			code: 0,
			message: err
		});
	}
});

app.delete('/api/v2/drive/object/:id', auth, async function(req, res) {
	try {
		res.contentType("application/json");
		res.set('Cache-Control', 'no-store');

		var id = req.params.id;

		if(!id) {
			res.status(400);
			throw "Unable to fulfill params";
		}

		var cd = new ChipDrive(req.token, null);

		await cd.init();

		if(!(await cd.has(id))) {
			res.status(404);
			throw "Item not found";
		}

		await cd.delete(id);

		res.json({});
	} catch(err) {
		res.json({
			code: 0,
			message: err
		});
	}
});

app.put('/api/v2/drive/object/:id', auth, async function(req, res) {
	try {
		res.contentType("application/json");
		res.set('Cache-Control', 'no-store');

		var id = req.params.id;

		if(!id) {
			res.status(400);
			throw "Unable to fulfill params";
		}

		var cd = new ChipDrive(req.token, null);

		await cd.init();

		if(!(await cd.has(id))) {
			res.status(404);
			throw "Item not found";
		}

		await new Promise((resolve, reject) => {
			pipeline(req, fs.createWriteStream(path.join(__dirname, `/database/${id}`)), (err) => {
				if(!err) {
					resolve();
				} else {
					reject(err);
				}
			})
		});

		res.json({});
	} catch(err) {
		res.json({
			code: 0,
			message: err
		});
	}
});

app.get('/api/v2/drive/object/:id', auth, async function(req, res) {
	try {
		res.contentType("application/json");
		res.set('Cache-Control', 'no-store');

		var id = req.params.id;

		if(!id) {
			res.status(400);
			throw "Unable to fulfill params";
		}

		var cd = new ChipDrive(req.token, null);

		await cd.init();

		if(!(await cd.has(id))) {
			res.status(404);
			throw "Item not found";
		}

		res.contentType("application/octet-stream");
		res.set('Cache-Control', 'no-store');
		res.sendFile(path.join(__dirname, `./database/${id}`));
	} catch(err) {
		res.json({
			code: 0,
			message: err
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