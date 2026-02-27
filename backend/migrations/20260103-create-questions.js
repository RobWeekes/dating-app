'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('questions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      questionnaireId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Questionnaires',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      text: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      type: {
        type: Sequelize.ENUM('text', 'single', 'multi', 'likert', 'slider', 'range'),
        defaultValue: 'text',
      },
      options: {
        type: Sequelize.JSON,
        defaultValue: [],
      },
      required: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      order: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });

    // Create index for common queries
    await queryInterface.addIndex('questions', ['questionnaireId']);
    await queryInterface.addIndex('questions', ['order']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('questions');
  },
};
