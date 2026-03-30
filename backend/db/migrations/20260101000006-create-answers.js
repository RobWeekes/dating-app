'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('answers', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      questionnaireResponseId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'questionnaire_responses',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      questionId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'questions',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      value: {
        type: Sequelize.TEXT
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

    await queryInterface.addIndex('answers', ['questionnaireResponseId']);
    await queryInterface.addIndex('answers', ['questionId']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('answers');
  }
};
