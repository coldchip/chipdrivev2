const { Sequelize, Model, DataTypes } = require('sequelize');
const sequelize = new Sequelize({
	dialect: 'sqlite',
	storage: './database/node.db',
	logging: false
});

class Node extends Model {}

Node.init({
	rid: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true
	},
	type: DataTypes.INTEGER,
	name: DataTypes.STRING,
	id: DataTypes.STRING,
	parent: DataTypes.STRING,
	user: DataTypes.STRING
}, { sequelize, modelName: 'node' });

module.exports = Node || {};

class ChipDrive {
	static FILE   = 1;
	static FOLDER = 2;

	constructor(user, db) {
		this.user = user;
		this.db = db;
	}

	async init() {
		await sequelize.sync();
		await Node.findOrCreate({
			where: {
				id: "root",
				user: this.user
			},
			defaults:{
				type: 2, 
				name: "root", 
				id: "root", 
				parent: this.user,
				user: this.user
			}
		});
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
		var nodes = await Node.findAll({
			where: {
				id: id,
				user: this.user
			}
		});

		if(nodes.length > 0) {
			return nodes[0];
		} else {
			throw "Node not found";
		}
			
	}

	async has(id) {
		var nodes = await Node.findAll({
			where: {
				id: id,
				user: this.user
			}
		})
		
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
			return await Node.findAll({
				where: {
					parent: id,
					user: this.user
				}
			});
		} else {
			throw "Folder not found";
		}
	}

	async create(parent, name, type) {
		if(await this.isFolder(parent)) {
			return await Node.create({
				type: type, 
				name: name, 
				id: ChipDrive.randID(32), 
				parent: parent,
				user: this.user
			});
		} else {
			throw "Folder not found";
		}
	}

	async rename(id, name) {
		if(await this.has(id)) {
			return await Node.update({
				name: name, 
			}, {
				where: { 
					id: id,
					user: this.user
				}
			});
		} else {
			throw "Node not found";
		}
	}

	async delete(id) {
		if(await this.has(id)) {
			return await Node.destroy({
				where: {
					id: id,
					user: this.user
				}
			});
		} else {
			throw "Node not found";
		}
	}

}

module.exports = ChipDrive || {};