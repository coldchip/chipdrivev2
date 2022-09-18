const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
	class Node extends Model {
		static associate(models) {
			Node.belongsTo(models.user);
		}
	}

	Node.init({
		type: DataTypes.INTEGER,
		name: DataTypes.STRING,
		id: {
			type: DataTypes.STRING,
			primaryKey: true,
			autoIncrement: false
		},
		parent: DataTypes.STRING,
		size: DataTypes.INTEGER
	}, {
		sequelize,
		modelName: 'node',
	});

	return Node;
};