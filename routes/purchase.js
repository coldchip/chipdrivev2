const express = require('express');

var md5 = require('md5');
const { tasks } = require("./../globals");
const random = require("./../utils/random");
const auth = require("./../middleware/auth");
const db = require("./../models");

const Node = db.node;
const User = db.user;
const Token = db.token;

const router = express.Router();

router.post('/', auth, async (req, res) => {
	tasks.push(async () => {
		res.contentType("application/json");
		res.set('Cache-Control', 'no-store');

		var id = req.body.id;
		if(id) {
			try {
				await User.update({
					quota: req.user.quota + (1024 * 1024)
				}, {
					where: { 
						id: req.user.id
					}
				});

				return res.status(200).json({});
				
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

module.exports = router;