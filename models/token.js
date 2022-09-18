'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Token extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
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