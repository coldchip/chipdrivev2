const fs = require('fs');
var md5 = require('md5');
const express = require('express');
const history = require("connect-history-api-fallback");
const bodyParser = require("body-parser");
const compression = require('compression');
const webpack = require("webpack");
const middleware = require("webpack-dev-middleware");

const driveRoute = require("./routes/chipdrive");
const ssoRoute = require("./routes/sso");

const db = require("./models");
const Node = db.node;
const User = db.user;
const Token = db.token;

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

const port = process.env.PORT || 5001;

(async function() {
	try {
		if(!fs.existsSync("database")){
			fs.mkdirSync("database");
		}

		await db.sequelize.authenticate();
		await db.sequelize.sync();

		let user = await User.findOrCreate({
			where: {
				username: "coldchip"
			},
			defaults: {
				firstname: "Ryan",
				lastname: "Loh",
				username: "coldchip",
				password: "0b3f45b266a97d7029dde7c2ba372093",
				admin: true,
				quota: 1024 * 1024 * 1024 * 100
			}
		});

		/*
			users can't delete the root folder
		*/

		let drives = ["My Drive #1", "My Drive #2", "My Drive #3", "My Drive #4", "My Drive #5"];

		for(let name of drives) {
			await Node.findOrCreate({
				where: {
					id: md5(name),
					userId: user[0].id
				},
				defaults: {
					type: 2, 
					name: name, 
					id: md5(name), 
					parent: null,
					size: 0,
					root: true,
					userId: user[0].id
				}
			});
		}

		app.use('/api/v2/drive', driveRoute);
		app.use('/api/v2/sso', ssoRoute);

		const compiler = webpack(require("./webpack.config.js"));
		app.use(history());
		app.use(middleware(compiler, {
			writeToDisk: true
		}));

		app.listen(port, () =>  {
			if(process.env.NODE_ENV) {
				console.log("Production Mode is Activated");
			}
			console.log(`ChipDrive is running on http://localhost:${port}`);
		});
	} catch(e) {
		console.log(`Unable to start server: ${e}`);
		process.exit(1);
	}
})();