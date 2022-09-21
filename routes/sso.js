const express = require('express');

var md5 = require('md5');
const random = require("./../utils/random");
const auth = require("./../middleware/auth");
const db = require("./../models");

const Node = db.node;
const User = db.user;
const Token = db.token;

const router = express.Router();

router.post('/login', async (req, res) => {
	res.contentType("application/json");
	res.set('Cache-Control', 'no-store');

	var username = req.body.username;
	var password = req.body.password;
	if(username && password) {
		try {
			let user = await User.findOne({
				where: {
					username: username,
					password: md5(password)
				}
			});

			if(user) {
				let token = random(64);

				await Token.create({
					id: token,
					expire: Math.floor(Date.now() / 1000) + 60 * 60,
					userId: user.id
				});

				return res.status(200).json({
					token: token
				});
			} else {
				return res.status(400).json({
					code: 400,
					message: "Invalid username or password"
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
			message: "Username or password is empty"
		});
	}
});

router.get('/logout', auth, async (req, res) => {
	res.contentType("application/json");
	res.set('Cache-Control', 'no-store');

	try {
		await Token.destroy({
			where: {
				id: req.token
			}
		});

		return res.status(200).json({});
	} catch(err) {
		return res.status(500).json({
			code: 500,
			message: "Server Internal Error"
		});
	}
	
});

router.get('/@me', auth, (req, res) => {
	res.contentType("application/json");
	res.set('Cache-Control', 'no-store');
		
	return res.status(200).json({
		name: `${req.user.firstname} ${req.user.lastname}`,
		username: req.user.username
	});
});

module.exports = router;