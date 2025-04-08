const { v4: uuidv4 } = require('uuid');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 1. Add the column
    await queryInterface.addColumn('Users', 'externalId', {
      type: Sequelize.UUID,
      allowNull: true, // temporarily allow null for backfilling
      unique: true,
    });

    // 2. Backfill existing users with UUIDs
    const [users] = await queryInterface.sequelize.query(`SELECT id FROM "Users"`);

    for (const user of users) {
      await queryInterface.sequelize.query(`
        UPDATE "Users"
        SET "externalId" = '${uuidv4()}'
        WHERE id = ${user.id}
      `);
    }

    // 3. Make externalId non-nullable
    await queryInterface.changeColumn('Users', 'externalId', {
      type: Sequelize.UUID,
      allowNull: false,
      unique: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Users', 'externalId');
  }
};
