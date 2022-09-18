const express = require('express');
const fs = require('fs');
const path = require('path');
const { pipeline } = require('stream');
var mime = require('mime-types');
const auth = require("./../middleware/auth");
const quota = require("./../middleware/quota");
const db = require("./../models");

const Node = db.node;
const User = db.user;
const Token = db.token;

const router = express.Router();

function randID(length) {
	var result           = [];
	var characters       = '0123456789abcdef';
	var charactersLength = characters.length;
	for ( var i = 0; i < length; i++ ) {
		result.push(characters.charAt(Math.floor(Math.random() * charactersLength)));
	}
	return result.join('');
}

router.get('/config', auth, (req, res) => {
	res.contentType("application/json");
	res.set('Cache-Control', 'no-store');

	let list = [{
		name: "My Drive",
		id: "root"
	}, {
		name: "Shared",
		id: "c37a134e4be06e94840b6082135cb0d1"
	}, {
		name: "Recently Deleted",
		id: "c37a134e4be06e94840b6082135cb0d2"
	}];

	return res.status(200).json(list);
});

router.get('/quota', auth, async (req, res) => {
	res.contentType("application/json");
	res.set('Cache-Control', 'no-store');

	try {
		var nodes = await Node.findAll({
			where: {
				userId: req.user.id
			}
		});

		var size = 0;

		for(const node of nodes) {
			size += node.dataValues.size;
		}

		var quota = {
			used: size,
			available: req.user.quota
		};

		return res.status(200).json(quota);
	} catch(err) {
		console.log(err);
		return res.status(500).json({
			code: 500,
			message: "Server Internal Error"
		});
	}
});

router.get('/breadcrumb', auth, async (req, res) => {
	res.contentType("application/json");
	res.set('Cache-Control', 'no-store');


	var id = req.query.id;
	if(id) {
		try {
			var result = [];
			while(true) {
				var node = await Node.findOne({ 
					where: { 
						id: id,
						userId: req.user.id
					} 
				});

				if(!node) {
					break
				}

				id = node.parent;

				result.unshift({
					name: node.name,
					id: node.id
				});
			}

			if(result.length > 0) {
				return res.status(200).json(result);
			} else {
				return res.status(404).json({
					code: 404, 
					message: "Node Not Found"
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
			message: "The server can't process the request"
		});
	}
});

router.get('/list', auth, async (req, res) => {
	res.contentType("application/json");
	res.set('Cache-Control', 'no-store');

	var folderid = req.query.folderid;
	var filter = req.query.filter;
	if(folderid) {
		try {
			var folder = await Node.findOne({ 
				where: { 
					id: folderid,
					userId: req.user.id
				} 
			});

			if(folder) {
				var list = await Node.findAll({ 
					where: { 
						parent: folderid,
						userId: req.user.id
					} 
				});

				if(filter) {
					list = list.filter((node) => {
						return node.name.toLowerCase().includes(filter.toLowerCase());
					});
				}

				return res.status(200).json(list);
			} else {
				return res.status(404).json({
					code: 404, 
					message: "Node Not Found"
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
			message: "The server can't process the request"
		});
	}
});

router.post('/file', auth, quota, async (req, res) => {
	res.contentType("application/json");
	res.set('Cache-Control', 'no-store');

	var folderid = req.body.folderid;
	var name = req.body.name;
	if(folderid && name) {
		try {
			var folder = await Node.findOne({ 
				where: { 
					id: folderid,
					userId: req.user.id
				} 
			});
			
			if(folder) {
				var node = await Node.create({
					type: 1, 
					name: name, 
					id: randID(32), 
					parent: folderid,
					userId: req.user.id
				});

				return res.status(201).json(node);
			} else {
				return res.status(404).json({
					code: 404, 
					message: "Node Not Found"
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
			message: "The server can't process the request"
		});
	}
});

router.post('/folder', auth, quota, async (req, res) => {
	res.contentType("application/json");
	res.set('Cache-Control', 'no-store');

	var name = req.body.name;
	var folderid = req.body.folderid;
	if(folderid && name) {
		try {
			var folder = await Node.findOne({ 
				where: { 
					id: folderid,
					userId: req.user.id
				} 
			});
			
			if(folder) {
				var node = await Node.create({
					type: 2, 
					name: name, 
					id: randID(32), 
					parent: folderid,
					userId: req.user.id
				});

				return res.status(201).json(node);
			} else {
				return res.status(404).json({
					code: 404, 
					message: "Node Not Found"
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
			message: "The server can't process the request"
		});
	}
});

router.patch('/object/:id', auth, async (req, res) => {
	res.contentType("application/json");
	res.set('Cache-Control', 'no-store');

	var id = req.params.id;
	var name = req.body.name;
	if(id && name) {
		try {
			var node = await Node.findOne({ 
				where: { 
					id: id,
					userId: req.user.id
				} 
			});

			if(node) {
				await Node.update({ 
					name: name 
				}, {
					where: { 
						id: id,
						userId: req.user.id
					}
				});

				return res.status(200).json({});
			} else {
				return res.status(404).json({
					code: 404, 
					message: "Node Not Found"
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
			message: "The server can't process the request"
		});
	}
});

router.delete('/object/:id', auth, async (req, res) => {
	res.contentType("application/json");
	res.set('Cache-Control', 'no-store');

	var id = req.params.id;
	if(id) {
		try {
			var node = await Node.findOne({ 
				where: { 
					id: id,
					userId: req.user.id
				} 
			});

			if(node) {
				await Node.destroy({
					where: {
						id: id,
						userId: req.user.id
					}
				});

				return res.status(200).json({});
			} else {
				return res.status(404).json({
					code: 404, 
					message: "Node Not Found"
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
			message: "The server can't process the request"
		});
	}
});

router.put('/object/:id', auth, quota, async (req, res) => {
	res.contentType("application/json");
	res.set('Cache-Control', 'no-store');

	var id = req.params.id;
	if(id) {
		try {
			var node = await Node.findOne({ 
				where: { 
					id: id,
					userId: req.user.id
				} 
			});

			if(node) {
				await new Promise((resolve, reject) => {
					pipeline(req, fs.createWriteStream(path.join(__dirname, `./../database/${id}`)), (err) => {
						if(!err) {
							resolve();
						} else {
							reject();
						}
					});
				});

				var size = fs.statSync(path.join(__dirname, `./../database/${id}`)).size;

				await Node.update({ 
					size: size 
				}, {
					where: { 
						id: id,
						userId: req.user.id
					}
				});

				return res.status(200).json({});
			} else {
				return res.status(404).json({
					code: 404, 
					message: "Node Not Found"
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
			message: "The server can't process the request"
		});
	}
});

router.get('/object/:id', async (req, res) => {
	res.set('Cache-Control', 'no-store');

	var id = req.params.id;
	if(id) {
		try {
			var node = await Node.findOne({ 
				where: { 
					id: id
				} 
			});

			if(node) {
				let type = mime.contentType(node.name);
				if(type) {
					res.contentType(type);
				}
				res.sendFile(path.join(__dirname, `./../database/${id}`));
			} else {
				return res.status(404).json({
					code: 404, 
					message: "Node Not Found"
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
			message: "The server can't process the request"
		});
	}
});

module.exports = router;