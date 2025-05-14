'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('Users', 'externalId', {
      type: Sequelize.UUID,
      defaultValue: Sequelize.literal('gen_random_uuid()')
    });
  },

  down: async (queryInterface, Sequelize) => {
    // remove the default if you ever roll back
    await queryInterface.changeColumn('Users', 'externalId', {
      type: Sequelize.UUID,
      defaultValue: null
    });
  }
};
