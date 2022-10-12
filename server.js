const chalk = require('chalk');
const fs = require('fs');
const path = require('path');
const md5 = require('md5');
const sharp = require('sharp');
const express = require('express');
const bodyParser = require("body-parser");
const compression = require('compression');
const webpack = require("webpack");
const middleware = require("webpack-dev-middleware");

const driveRoute = require("./routes/chipdrive");
const ssoRoute = require("./routes/sso");
const purchaseRoute = require("./routes/purchase");

const random = require("./utils/random");

const { tasks } = require("./globals");

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
	console.log(`[${chalk.blue(new Date().toUTCString())}] ${chalk.yellow(req.method.padEnd(6))} ${chalk.green(req.path)}`);
	next()
});

app.set('x-powered-by', false);

const port = process.env.PORT || 5001;

(async function() {
	console.log(chalk.yellow("ChipDrive Server"));
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
				quota: 1024 * 1024 * 100
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
		app.use('/api/v2/purchase', purchaseRoute);

		const compiler = webpack(require("./webpack.config.js"));
		app.use(middleware(compiler, {
			writeToDisk: true
		}));

		worker();

		app.listen(port, () =>  {
			if(process.env.NODE_ENV) {
				console.log("Production Mode is Activated");
			}
			console.log(`ChipDrive is running on http://localhost:${port}`);
		});
	} catch(e) {
		console.log(`Unable to start server: ${e.toString()}`);
		process.exit(1);
	}
})();

var image = ["jpg", "png", "jpeg", "bmp", "h264", "gif", "svg"]

async function worker() {
	if(tasks.length > 0) {
		console.log(chalk.yellow(`Dequeuing tasks, ${tasks.length} in queue`));
		let task = tasks.pop();
		await task();
	}

	let nodes = await Node.findAll({
		where: {
			type: 1,
			thumbnail: {
				[db.Sequelize.Op.eq]: null
			}
		}
	});

	for(let node of nodes) {
		var ext = node.name.substr(node.name.lastIndexOf('.') + 1).toLowerCase();
		if(node && image.includes(ext)) {
			console.log(node);
			try {
				let id = random(64);

				console.log(node);

				let success = await sharp(path.join(__dirname, `./database/${node.id}`))
				.resize(200, 200)
				.toFile(path.join(__dirname, `./database/${id}`));

				if(success) {
					await Node.create({
						type: 1, 
						name: `${node.name}_thumbnail.png`,
						thumbnail: id,
						id: id, 
						parent: id,
						root: false,
						userId: node.userId
					});

					await Node.update({ 
						thumbnail: id
					}, { 
						where: { 
							id: node.id 
						} 
					});
				}
			} catch(e) {}
		}
	}

	setTimeout(worker, 50);
}