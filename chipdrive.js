const Node = require("./models").node;

class ChipDrive {
	static FILE   = 1;
	static FOLDER = 2;

	constructor(user, db) {
		this.user = user;
		this.db = db;
	}

	async init() {
		if(this.user) {
			await Node.findOrCreate({
				where: {
					id: "root",
					userId: this.user
				},
				defaults: {
					type: 2, 
					name: "My Drive", 
					id: "root", 
					parent: this.user,
					size: 0,
					userId: this.user
				}
			});
		}
	}

	static randID(length) {
		var result           = [];
		var characters       = '0123456789abcdef';
		var charactersLength = characters.length;
		for ( var i = 0; i < length; i++ ) {
			result.push(characters.charAt(Math.floor(Math.random() * charactersLength)));
		}
		return result.join('');
	}

	async get(id) {
		var nodes;

		if(this.user) {
			nodes = await Node.findAll({
				where: {
					id: id,
					userId: this.user
				}
			});
		} else {
			nodes = await Node.findAll({
				where: {
					id: id
				}
			});
		}

		if(nodes.length > 0) {
			return nodes[0];
		} else {
			throw "Node not found";
		}
			
	}

	async set(id, data) {
		if(await this.has(id)) {
			await Node.update(data, {
				where: { 
					id: id,
					userId: this.user
				}
			});

			return true;
		} else {
			throw "Node not found";
		}
	}

	async has(id) {
		var nodes;
		if(this.user) {
			nodes = await Node.findAll({
				where: {
					id: id,
					userId: this.user
				}
			});
		} else {
			nodes = await Node.findAll({
				where: {
					id: id
				}
			});
		}
		
		return nodes.length > 0;
	}

	async isFile(id) {
		if(await this.has(id)) {
			var node = await this.get(id);
			if(node.type === ChipDrive.FILE) {
				return true;
			}
		}
		return false;
	}

	async isFolder(id) {
		if(await this.has(id)) {
			var node = await this.get(id);
			if(node.type === ChipDrive.FOLDER) {
				return true;
			}
		}
		return false;
	}

	async list(id) {
		if(await this.isFolder(id)) {
			var list = await Node.findAll({
				where: {
					parent: id,
					userId: this.user
				}
			});

			return list.map((node) => node.dataValues);
		} else {
			throw "Folder not found";
		}
	}

	async create(parent, name, type) {
		if(await this.isFolder(parent)) {
			var node = await Node.create({
				type: type, 
				name: name, 
				id: ChipDrive.randID(32), 
				parent: parent,
				userId: this.user
			});

			return node.dataValues;
		} else {
			throw "Folder not found";
		}
	}

	async delete(id) {
		if(await this.has(id)) {
			await Node.destroy({
				where: {
					id: id,
					userId: this.user
				}
			});

			return true;
		} else {
			throw "Node not found";
		}
	}

	async usage() {
		var nodes = await Node.findAll({
			where: {
				userId: this.user
			}
		});

		var size = 0;

		for(const node of nodes) {
			size += node.dataValues.size;
		}

		return size;
	}

}

module.exports = ChipDrive || {};