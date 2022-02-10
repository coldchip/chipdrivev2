const fs = require('fs');
const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const bodyParser = require("body-parser");
const compression = require('compression');
const path = require('path');
const webpack = require("webpack");
const middleware = require("webpack-dev-middleware");

var app = express();

const compiler = webpack(require("./webpack.config.js"));
app.use(
	middleware(compiler, {
		// webpack-dev-middleware options
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

app.get('*', (req, res) => {
	res.contentType("application/json");
	res.set('Cache-Control', 'no-store');
	res.status(404);
	res.send("error 404");
});

app.set('x-powered-by', false);

const port = 5001;

app.listen(port, () =>  {
	if(process.env.NODE_ENV) {
		console.log("Production Mode is Activated");
	}
    console.log('ChipDrive is running on http://localhost:' + port);
});