'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Preferences', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true,
        references: {
          model: 'Users',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      minAge: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 18
      },
      maxAge: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 65
      },
      location: {
        type: Sequelize.STRING,
        allowNull: true
      },
      locationRadius: {
        type: Sequelize.INTEGER,
        allowNull: true,
        comment: 'Search radius in miles'
      },
      interests: {
        type: Sequelize.JSON,
        allowNull: true,
        defaultValue: []
      },
      relationshipType: {
        type: Sequelize.STRING,
        allowNull: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('now')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('now')
      }
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('Preferences');
  }
};
