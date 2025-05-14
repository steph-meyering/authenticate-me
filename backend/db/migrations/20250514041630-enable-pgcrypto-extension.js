'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // pgcrypto in Postgres ≥13 provides gen_random_uuid()
    await queryInterface.sequelize.query(
      `CREATE EXTENSION IF NOT EXISTS "pgcrypto";`
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(
      `DROP EXTENSION IF EXISTS "pgcrypto";`
    );
  }
};
