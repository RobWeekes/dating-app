'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.renameColumn('Questionnaires', 'personalityType', 'questionnaire');
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.renameColumn('Questionnaires', 'questionnaire', 'personalityType');
  }
};
