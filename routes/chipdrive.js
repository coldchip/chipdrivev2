const express = require('express');
const fs = require('fs');
const path = require('path');
const { pipeline } = require('stream');
var mime = require('mime-types');

const { tasks } = require("./../globals");
const random = require("./../utils/random");
const auth = require("./../middleware/auth");
const quota = require("./../middleware/quota");
const db = require("./../models");

const Node = db.node;
const User = db.user;
const Token = db.token;

const router = express.Router();

router.get('/config', auth, (req, res) => {
	tasks.push(async () => {
		res.contentType("application/json");
		res.set('Cache-Control', 'no-store');
		try {
			var nodes = await Node.findAll({
				where: {
					root: true,
					userId: req.user.id
				}
			});

			return res.status(200).json(nodes);
		} catch(err) {
			return res.status(500).json({
				code: 500,
				message: "Server Internal Error"
			});
		}
	});
});

router.get('/quota', auth, (req, res) => {
	tasks.push(async () => {
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
			return res.status(500).json({
				code: 500,
				message: "Server Internal Error"
			});
		}
	});
});

router.get('/breadcrumb/:id', auth, (req, res) => {
	tasks.push(async () => {
		res.contentType("application/json");
		res.set('Cache-Control', 'no-store');


		var id = req.params.id;
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
});

router.get('/list/:id', auth, (req, res) => {
	tasks.push(async () => {
		res.contentType("application/json");
		res.set('Cache-Control', 'no-store');

		var id = req.params.id;
		var filter = req.query.filter;
		if(id) {
			try {
				var folder = await Node.findOne({ 
					where: { 
						id: id,
						userId: req.user.id
					} 
				});

				if(folder) {
					var list = await Node.findAll({ 
						where: { 
							parent: id,
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
});

router.post('/file', auth, quota, (req, res) => {
	tasks.push(async () => {
		res.contentType("application/json");
		res.set('Cache-Control', 'no-store');

		var id = req.body.id;
		var name = req.body.name;
		if(id && name) {
			try {
				var folder = await Node.findOne({ 
					where: { 
						id: id,
						userId: req.user.id
					} 
				});
				
				if(folder) {
					var node = await Node.create({
						type: 1, 
						name: name, 
						id: random(64), 
						parent: id,
						root: false,
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
});

router.post('/folder', auth, quota, (req, res) => {
	tasks.push(async () => {
		res.contentType("application/json");
		res.set('Cache-Control', 'no-store');

		var id = req.body.id;
		var name = req.body.name;
		if(id && name) {
			try {
				var folder = await Node.findOne({ 
					where: { 
						id: id,
						userId: req.user.id
					} 
				});
				
				if(folder) {
					var node = await Node.create({
						type: 2, 
						name: name, 
						id: random(64), 
						parent: id,
						root: false,
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
});

router.patch('/object/:id', auth, (req, res) => {
	tasks.push(async () => {
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
});

router.delete('/object/:id', auth, (req, res) => {
	tasks.push(async () => {
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
					if(node.root === false) {
						await Node.destroy({
							where: {
								id: id,
								userId: req.user.id
							}
						});

						return res.status(200).json({});
					} else {
						return res.status(403).json({
							code: 403, 
							message: "No permissions to delete this node"
						});
					}
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
});

router.put('/object/:id', auth, quota, (req, res) => {
	tasks.push(async () => {
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
					pipeline(req, fs.createWriteStream(path.join(__dirname, `./../database/${id}`)), (err) => {
						if(!err) {
							return res.status(200).json({});
						} else {
							return res.status(500).json({
								code: 500, 
								message: "File I/O error"
							});
						}
					});
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
});

router.get('/object/:id', (req, res) => {
	tasks.push(async () => {
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
});

router.get('/info/:id', (req, res) => {
	tasks.push(async () => {
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
					return res.status(200).json(node);
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
});

module.exports = router;