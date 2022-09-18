const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class User extends Model {
		static associate(models) {
			User.hasMany(models.node);
			User.hasMany(models.token);
		}
	}
	User.init({
		firstname: DataTypes.STRING,
		lastname: DataTypes.STRING,
		username: DataTypes.STRING,
		password: DataTypes.STRING,
		admin: DataTypes.BOOLEAN,
		quota: DataTypes.INTEGER
	}, {
		sequelize,
		modelName: 'user',
	});
	return User;
};