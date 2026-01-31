'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('mvp_questionnaire_scores', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      userId1: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      userId2: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      personalityScore: {
        type: Sequelize.FLOAT,
        allowNull: true,
        comment: 'Big Five personality compatibility (0-100)',
      },
      valuesScore: {
        type: Sequelize.FLOAT,
        allowNull: true,
        comment: 'Core values alignment (0-100)',
      },
      familyScore: {
        type: Sequelize.FLOAT,
        allowNull: true,
        comment: 'Family planning compatibility (0-100)',
      },
      financialScore: {
        type: Sequelize.FLOAT,
        allowNull: true,
        comment: 'Financial attitudes compatibility (0-100)',
      },
      lifestyleScore: {
        type: Sequelize.FLOAT,
        allowNull: true,
        comment: 'Lifestyle preferences compatibility (0-100)',
      },
      workLifeScore: {
        type: Sequelize.FLOAT,
        allowNull: true,
        comment: 'Work-life balance compatibility (0-100)',
      },
      healthScore: {
        type: Sequelize.FLOAT,
        allowNull: true,
        comment: 'Health & wellness compatibility (0-100)',
      },
      physicalScore: {
        type: Sequelize.FLOAT,
        allowNull: true,
        comment: 'Physical preferences compatibility (0-100)',
      },
      overallCompatibilityScore: {
        type: Sequelize.FLOAT,
        allowNull: false,
        validate: {
          min: 0,
          max: 100,
        },
        comment: 'Weighted overall score (0-100)',
      },
      matchRating: {
        type: Sequelize.INTEGER,
        allowNull: false,
        validate: {
          min: 1,
          max: 5,
        },
        comment: '1-5 stars based on overall score',
      },
      redFlags: {
        type: Sequelize.JSON,
        allowNull: true,
        comment: 'Array of critical incompatibilities detected',
      },
      incompatibilityReasons: {
        type: Sequelize.JSON,
        allowNull: true,
        comment: 'Detailed reasons for low scores',
      },
      calculatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });

    // Add unique constraint on userId1 and userId2
    await queryInterface.addConstraint('mvp_questionnaire_scores', {
      fields: ['userId1', 'userId2'],
      type: 'unique',
      name: 'unique_user_pair',
    });

    // Add indexes for performance
    await queryInterface.addIndex('mvp_questionnaire_scores', {
      fields: ['userId1'],
      name: 'idx_mvp_scores_user1',
    });

    await queryInterface.addIndex('mvp_questionnaire_scores', {
      fields: ['userId2'],
      name: 'idx_mvp_scores_user2',
    });

    await queryInterface.addIndex('mvp_questionnaire_scores', {
      fields: ['overallCompatibilityScore'],
      name: 'idx_mvp_scores_overall',
    });

    await queryInterface.addIndex('mvp_questionnaire_scores', {
      fields: ['matchRating'],
      name: 'idx_mvp_scores_rating',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('mvp_questionnaire_scores');
  },
};
