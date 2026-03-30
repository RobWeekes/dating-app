'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('questionnaire_responses', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onDelete: 'CASCADE'
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
      status: {
        type: Sequelize.STRING,
        defaultValue: 'in_progress'
      },
      completedAt: {
        type: Sequelize.DATE
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

    await queryInterface.addIndex('questionnaire_responses', ['userId']);
    await queryInterface.addIndex('questionnaire_responses', ['questionnaireId']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('questionnaire_responses');
  }
};
