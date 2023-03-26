const express = require('express');

var md5 = require('md5');
const crypto = require('crypto');
const random = require("./../utils/random");
const auth = require("./../middleware/auth");
const enqueue = require("./../middleware/enqueue");
const db = require("./../models");

const Node = db.node;
const User = db.user;
const Token = db.token;

const router = express.Router();

router.post('/login', enqueue("login", async (req, res) => {
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
				var token = crypto.randomBytes(64).toString('hex');

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
					message: "Invalid username or password"
				});
			}
		} catch(err) {
			return res.status(500).json({
				message: "Server Internal Error"
			});
		}
	} else {
		return res.status(400).json({
			message: "Username or password is empty"
		});
	}
}));

router.get('/logout', auth, enqueue("main", async (req, res) => {
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
			message: "Server Internal Error"
		});
	}
}));

router.get('/@me', auth, enqueue("main", async (req, res) => {
	res.contentType("application/json");
	res.set('Cache-Control', 'no-store');
		
	return res.status(200).json({
		firstname: req.user.firstname,
		lastname: req.user.lastname,
		username: req.user.username,
		quota: req.user.quota
	});
}));

router.patch('/@me', auth, enqueue("main", async (req, res) => {
	res.contentType("application/json");
	res.set('Cache-Control', 'no-store');

	var firstname = req.body.firstname;
	var lastname = req.body.lastname;
	var username = req.body.username;
	var quota = req.body.quota;
	if(firstname && lastname && username && quota) {
		try {
			await User.update({
				firstname: firstname,
				lastname: lastname, 
				username: username,
				quota: quota
			}, {
				where: {
					id: req.user.id
				}
			});

			return res.status(200).json({});
		} catch(err) {
			return res.status(500).json({
				message: "Server Internal Error"
			});
		}
	} else {
		return res.status(400).json({
			message: "The server can't process the request"
		});
	}
}));

module.exports = router;