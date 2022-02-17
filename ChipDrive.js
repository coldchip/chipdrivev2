const { Sequelize, Model, DataTypes } = require('sequelize');
const sequelize = new Sequelize({
	dialect: 'sqlite',
	storage: './database/node.db'
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

		sequelize.sync().then(() => {
			Node.findOrCreate({
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
			})
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

	async has(id) {
		return new Promise((resolve, reject) => {
			Node.findAll({
				where: {
					id: id,
					user: this.user
				}
			}).then((nodes) => {
				resolve(nodes.length > 0)
			}).catch((err) => {
				reject(err);
			});
		});
	}

	async list(id) {
		return new Promise(async (resolve, reject) => {
			if(await this.has(id)) {
				Node.findAll({
					where: {
						parent: id,
						user: this.user
					}
				}).then((nodes) => {
					resolve(nodes);
				}).catch((err) => {
					reject(err);
				});
			} else {
				reject("Folder not found");
			}
		});
	}

	async create(parent, name, type) {
		return new Promise((resolve, reject) => {
			if(this.has(parent)) {
				Node.create({
					type: type, 
					name: name, 
					id: ChipDrive.randID(32), 
					parent: parent,
					user: this.user
				}).then((node) => {
					resolve(node.dataValues);
				}).catch((err) => {
					reject(err);
				});
			} else {
				reject("Folder not found");
			}
		});
	}

	async rename(id, name) {
		return new Promise(async (resolve, reject) => {
			if(await this.has(id)) {
				Node.update({
					name: name, 
				}, {
					where: { 
						id: id,
						user: this.user
					}
				}).then((results) => {
					resolve();
				}).catch((err) => {
					reject(err);
				});
			} else {
				reject("Item not found");
			}
		});
	}

	async delete(id) {
		return new Promise(async (resolve, reject) => {
			if(await this.has(id)) {
				Node.destroy({
					where: {
						id: id,
						user: this.user
					}
				}).then((results) => {
					resolve();
				}).catch((err) => {
					reject(err);
				});
			} else {
				reject("Item not found");
			}
		});
	}

}

module.exports = ChipDrive || {};