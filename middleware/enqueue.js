const queue = require("./../queue");

function enqueue(name, cb) {
	return (req, res) => {

		let wrapper = () => {
			cb(req, res);
		};

		if(!queue.enqueue(name, wrapper)) {
			return res.status(503).json({
				message: "Server Overloaded"
			});
		}
	}
}

module.exports = enqueue;