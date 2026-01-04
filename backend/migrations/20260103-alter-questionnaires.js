'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Remove userId column (questionnaires are now templates, not user-specific)
    if (await queryInterface.describeTable('Questionnaires').then(table => table.userId)) {
      await queryInterface.removeColumn('Questionnaires', 'userId');
    }

    // Remove old user-specific columns
    const table = await queryInterface.describeTable('Questionnaires');
    
    if (table.interests) {
      await queryInterface.removeColumn('Questionnaires', 'interests');
    }
    if (table.datingGoal) {
      await queryInterface.removeColumn('Questionnaires', 'datingGoal');
    }
    if (table.relationshipType) {
      await queryInterface.removeColumn('Questionnaires', 'relationshipType');
    }
    if (table.responses) {
      await queryInterface.removeColumn('Questionnaires', 'responses');
    }
    if (table.questionnaire) {
      await queryInterface.removeColumn('Questionnaires', 'questionnaire');
    }
    if (table.personalityType) {
      await queryInterface.removeColumn('Questionnaires', 'personalityType');
    }

    // Add new template-specific columns
    await queryInterface.addColumn('Questionnaires', 'type', {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
      defaultValue: 'generic',
    });

    await queryInterface.addColumn('Questionnaires', 'title', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 'Untitled',
    });

    await queryInterface.addColumn('Questionnaires', 'description', {
      type: Sequelize.TEXT,
      allowNull: true,
    });

    await queryInterface.addColumn('Questionnaires', 'category', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn('Questionnaires', 'version', {
      type: Sequelize.INTEGER,
      defaultValue: 1,
    });

    await queryInterface.addColumn('Questionnaires', 'isActive', {
      type: Sequelize.BOOLEAN,
      defaultValue: true,
    });
  },

  async down(queryInterface, Sequelize) {
    // Remove new columns
    await queryInterface.removeColumn('Questionnaires', 'type');
    await queryInterface.removeColumn('Questionnaires', 'title');
    await queryInterface.removeColumn('Questionnaires', 'description');
    await queryInterface.removeColumn('Questionnaires', 'category');
    await queryInterface.removeColumn('Questionnaires', 'version');
    await queryInterface.removeColumn('Questionnaires', 'isActive');

    // Add back old columns (if needed for rollback)
    await queryInterface.addColumn('Questionnaires', 'userId', {
      type: Sequelize.INTEGER,
      allowNull: false,
    });

    await queryInterface.addColumn('Questionnaires', 'questionnaire', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn('Questionnaires', 'interests', {
      type: Sequelize.JSON,
      defaultValue: [],
    });

    await queryInterface.addColumn('Questionnaires', 'datingGoal', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn('Questionnaires', 'relationshipType', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn('Questionnaires', 'responses', {
      type: Sequelize.JSON,
      defaultValue: {},
    });
  },
};
