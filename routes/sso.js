const express = require('express');
const auth = require("./../middleware/auth");
const db = require("./../models");

const Node = db.node;
const User = db.user;
const Token = db.token;

const router = express.Router();

router.get('/@me', auth, (req, res) => {
	res.contentType("application/json");
	res.set('Cache-Control', 'no-store');
		
	return res.status(200).json({
		name: `${req.user.firstname} ${req.user.lastname}`,
		username: req.user.username
	});
});

module.exports = router;