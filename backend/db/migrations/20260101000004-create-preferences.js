'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('preferences', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true,
        references: {
          model: 'users',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      minAge: {
        type: Sequelize.INTEGER,
        defaultValue: 18
      },
      maxAge: {
        type: Sequelize.INTEGER,
        defaultValue: 100
      },
      location: {
        type: Sequelize.STRING
      },
      locationRadius: {
        type: Sequelize.INTEGER,
        defaultValue: 50
      },
      interests: {
        type: Sequelize.JSON,
        defaultValue: []
      },
      relationshipType: {
        type: Sequelize.STRING
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('preferences');
  }
};
