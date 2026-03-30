'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('mvp_questionnaire_scores', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      userId1: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      userId2: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      personalityScore: {
        type: Sequelize.FLOAT
      },
      valuesScore: {
        type: Sequelize.FLOAT
      },
      familyScore: {
        type: Sequelize.FLOAT
      },
      financialScore: {
        type: Sequelize.FLOAT
      },
      lifestyleScore: {
        type: Sequelize.FLOAT
      },
      workLifeScore: {
        type: Sequelize.FLOAT
      },
      healthScore: {
        type: Sequelize.FLOAT
      },
      physicalScore: {
        type: Sequelize.FLOAT
      },
      overallCompatibilityScore: {
        type: Sequelize.FLOAT,
        allowNull: false
      },
      matchRating: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      redFlags: {
        type: Sequelize.JSON
      },
      incompatibilityReasons: {
        type: Sequelize.JSON
      },
      calculatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
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

    await queryInterface.addIndex('mvp_questionnaire_scores', ['userId1', 'userId2'], {
      unique: true
    });
    await queryInterface.addIndex('mvp_questionnaire_scores', ['userId1']);
    await queryInterface.addIndex('mvp_questionnaire_scores', ['userId2']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('mvp_questionnaire_scores');
  }
};
