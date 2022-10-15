const express = require('express');

var md5 = require('md5');

const random = require("./../utils/random");
const auth = require("./../middleware/auth");
const enqueue = require("./../middleware/enqueue");
const db = require("./../models");

const Node = db.node;
const User = db.user;
const Token = db.token;

const router = express.Router();

router.post('/', auth, enqueue("drive", async (req, res) => {
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