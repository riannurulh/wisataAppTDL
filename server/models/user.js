'use strict';
const {
  Model
} = require('sequelize');
const { hashPassword } = require('../helpers/bcrypt');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.TodoList, { foreignKey: 'UserId' });
      User.hasMany(models.Category, { foreignKey: 'UserId' });
    }
  }
  User.init({
    fullName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "First name is required",
        },
        notNull: {
          msg: "First name is required",
        },
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: {
          msg: "Email is required",
        },
        notNull: {
          msg: "Email is required",
        },
        isEmail: {
          msg: "Invalid email format",
        },
        
      }
    },
    password: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
    hooks: {
      beforeCreate: (user, options) => {
        user.password = hashPassword(user.password)
      }
    }
  });
  return User;
};