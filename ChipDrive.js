

class ChipDrive {
	static FILE   = 1;
	static FOLDER = 2;

	constructor(user, db) {
		this.user = user;
		this.db = db;
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

	has(id) {
		return this.db.find((node) => {
			return node.id === id;
		});
	}

	async list(id) {
		return new Promise((resolve, reject) => {
			if(this.has(id)) {

				var list = this.db.filter((node) => {
					return node.parent === id;
				});

				resolve(list);
			} else {
				reject("Folder not found");
			}
		});
	}

	async create(parent, name, type) {
		return new Promise((resolve, reject) => {
			if(this.has(parent)) {
				var node = {"type": type, "name": name, "id": ChipDrive.randID(32), "parent": parent};
				this.db.push(node);
				resolve(node);
			} else {
				reject("Folder not found");
			}
		});
	}

	async rename(id, name) {
		return new Promise((resolve, reject) => {
			if(this.has(id)) {
				this.db.forEach((node) => {
					if(node.id == id) {
						node.name = name;
					}
				});
				resolve();
			} else {
				reject("Item not found");
			}
		});
	}

	delete(id) {
		if(this.has(id)) {
			this.db.forEach((node) => {
				if(node.id == id) {
					node = null;
				}
			});
		} else {
			reject("Item not found");
		}
	}

}

module.exports = ChipDrive || {};