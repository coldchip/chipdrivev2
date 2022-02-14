

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

	list(id) {
		return this.db.filter((node) => {
			return node.parent === id;
		});
	}

	create(parent, name, type) {
		var node = {"type": type, "name": name, "id": ChipDrive.randID(32), "parent": parent};
		this.db.push(node);

		return node;
	}

	rename(id, name) {
		this.db.forEach((node) => {
			if(node.id == id) {
				node.name = name;
			}
		});
	}

	delete(id) {
		this.db.forEach((node) => {
			if(node.id == id) {
				node = null;
			}
		});
	}

}

module.exports = ChipDrive || {};