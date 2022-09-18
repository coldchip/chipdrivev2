const fs = require('fs');
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

function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   return result;
}

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
				firstname: "Admin",
				lastname: "",
				username: "coldchip",
				password: "123456",
				admin: true,
				quota: 1024 * 1024 * 1024 * 100
			}
		});

		await Token.findOrCreate({
			where: {
				id: "abcdef"
			},
			defaults: {
				id: "abcdef",
				userId: user[0].id
			}
		});

		await Token.findOrCreate({
			where: {
				id: "abcdef1"
			},
			defaults: {
				id: "abcdef1",
				userId: user[0].id
			}
		});

		/*
			users can't delete the root folder
		*/

		await Node.findOrCreate({
			where: {
				id: "root",
				userId: user[0].id
			},
			defaults: {
				type: 2, 
				name: "My Drive", 
				id: "root", 
				parent: null,
				size: 0,
				userId: user[0].id
			}
		});

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