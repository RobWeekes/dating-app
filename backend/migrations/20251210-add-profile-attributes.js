'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Users', 'bodyType', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn('Users', 'bmi', {
      type: Sequelize.DECIMAL(5, 2),
      allowNull: true,
    });

    await queryInterface.addColumn('Users', 'politics', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn('Users', 'religion', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn('Users', 'ethnicity', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn('Users', 'family', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn('Users', 'familyGoals', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Users', 'bodyType');
    await queryInterface.removeColumn('Users', 'bmi');
    await queryInterface.removeColumn('Users', 'politics');
    await queryInterface.removeColumn('Users', 'religion');
    await queryInterface.removeColumn('Users', 'ethnicity');
    await queryInterface.removeColumn('Users', 'family');
    await queryInterface.removeColumn('Users', 'familyGoals');
  }
};
