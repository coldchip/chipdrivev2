const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
	class Token extends Model {
		static associate(models) {
			Token.belongsTo(models.user);
		}
	}
	
	Token.init({
		id: {
			type: DataTypes.STRING,
			primaryKey: true,
			autoIncrement: false
		}
	}, {
		sequelize,
		modelName: 'token',
	});

	return Token;
};