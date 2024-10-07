'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('TodoLists', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      UserId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "User ID is required",
          },
          notNull: {
            msg: "User ID is required",
          },
        },
        references: {
          model: 'Users',
          key: 'id',
        },
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Title is required",
          },
          notNull: {
            msg: "Title is required",
          },
        },
      },
      description: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Description is required",
          },
          notNull: {
            msg: "Description is required",
          },
        },
      },
      dueDate: {
        type: Sequelize.DATE,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Due date is required",
          },
          notNull: {
            msg: "Due date is required",
          },
          verifyDate(value) {
            if (value < new Date()) {
              throw new Error("Due date must be in the future");
            }
          },
        },
      },
      status: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Status is required",
          },
          notNull: {
            msg: "Status is required",
          },
        },
      },
      CategoryId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Category ID is required",
          },
          notNull: {
            msg: "Category ID is required",
          },
        },
        references: {
          model: 'Categories',
          key: 'id',
        },
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('TodoLists');
  }
};