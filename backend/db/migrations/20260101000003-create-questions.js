'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('questions', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      questionnaireId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'questionnaires',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      text: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      type: {
        type: Sequelize.STRING,
        defaultValue: 'text'
      },
      options: {
        type: Sequelize.JSON,
        defaultValue: []
      },
      required: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      order: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      section: {
        type: Sequelize.STRING
      },
      sectionDescription: {
        type: Sequelize.STRING
      },
      reversed: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      critical: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      conditional: {
        type: Sequelize.JSON
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

    await queryInterface.addIndex('questions', ['questionnaireId']);
    await queryInterface.addIndex('questions', ['order']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('questions');
  }
};
