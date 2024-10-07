'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TodoList extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      TodoList.belongsTo(models.User, { foreignKey: 'UserId' });
      TodoList.belongsTo(models.Category, { foreignKey: 'CategoryId' });
    }
  }
  TodoList.init({
    UserId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "User ID is required",
        },
        notNull: {
          msg: "User ID is required",
        },
      }
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Title is required",
        },
        notNull: {
          msg: "Title is required",
        },
      }
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Description is required",
        },
        notNull: {
          msg: "Description is required",
        },
      }
    },
    dueDate: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Due date is required",
        },
        notNull: {
          msg: "Due date is required",
        },
        isAfterToday(value) {
          if (value.toISOString().slice(0,10) < new Date().toISOString().slice(0,10)) {
            console.log(value.toISOString().slice(0,10));
            throw new Error("Due date must be in the future");
          }
        },
      }
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Status is required",
        },
        notNull: {
          msg: "Status is required",
        },
      }
    },
    CategoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Category ID is required",
        },
        notNull: {
          msg: "Category ID is required",
        },
      }
    }
  }, {
    sequelize,
    modelName: 'TodoList',
  });
  return TodoList;
};