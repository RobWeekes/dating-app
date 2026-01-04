'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const table = await queryInterface.describeTable('Answers');

    // Rename questionnaireId to questionnaireResponseId
    if (table.questionnaireId) {
      await queryInterface.renameColumn('Answers', 'questionnaireId', 'questionnaireResponseId');
    }

    // Rename answer to value
    if (table.answer) {
      await queryInterface.renameColumn('Answers', 'answer', 'value');
    }

    // Change value to allow NULL (not all question types require an answer initially)
    await queryInterface.changeColumn('Answers', 'value', {
      type: Sequelize.TEXT,
      allowNull: true,
    });

    // Update foreign key reference from questionnaires to questionnaire_responses
    await queryInterface.changeColumn('Answers', 'questionnaireResponseId', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'questionnaire_responses',
        key: 'id',
      },
      onDelete: 'CASCADE',
    });

    // Change questionId from STRING to INTEGER
    if (table.questionId && table.questionId.type.toUpperCase() !== 'INTEGER') {
      await queryInterface.changeColumn('Answers', 'questionId', {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Questions',
          key: 'id',
        },
        onDelete: 'CASCADE',
      });
    } else if (!table.questionId) {
      // If it doesn't exist yet (shouldn't happen), add it
      await queryInterface.addColumn('Answers', 'questionId', {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Questions',
          key: 'id',
        },
        onDelete: 'CASCADE',
      });
    }

    // Create index for common queries
    await queryInterface.addIndex('Answers', ['questionnaireResponseId']);
    await queryInterface.addIndex('Answers', ['questionId']);
  },

  async down(queryInterface, Sequelize) {
    const table = await queryInterface.describeTable('Answers');

    // Rename back
    if (!table.questionnaireId) {
      await queryInterface.renameColumn('Answers', 'questionnaireResponseId', 'questionnaireId');
    }

    if (!table.answer) {
      await queryInterface.renameColumn('Answers', 'value', 'answer');
    }

    // Change back to NOT NULL
    await queryInterface.changeColumn('Answers', 'answer', {
      type: Sequelize.TEXT,
      allowNull: false,
    });

    // Revert foreign key
    await queryInterface.changeColumn('Answers', 'questionnaireId', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'Questionnaires',
        key: 'id',
      },
      onDelete: 'CASCADE',
    });

    // Change questionId back to STRING
    await queryInterface.changeColumn('Answers', 'questionId', {
      type: Sequelize.STRING,
      allowNull: false,
    });
  },
};
