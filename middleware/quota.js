const db = require("./../models");

const Node = db.node;

async function quota(req, res, next) {
	var nodes = await Node.findAll({
		where: {
			userId: req.user.id
		}
	});

	var size = 0;

	for(const node of nodes) {
		size += node.dataValues.size;
	}

	if(size <= req.user.quota) {
		next();
	} else {
		return res.status(413).json({
			code: 413, 
			message: "No storage space left"
		});
	}
}

module.exports = quota;