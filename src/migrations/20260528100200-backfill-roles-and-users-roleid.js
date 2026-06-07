'use strict';

module.exports = {
  async up(queryInterface) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      const [roles] = await queryInterface.sequelize.query(
        'SELECT id FROM roles ORDER BY id LIMIT 1',
        { transaction }
      );

      let defaultRoleId;

      if (roles.length === 0) {
        const now = new Date();

        await queryInterface.bulkInsert(
          'roles',
          [{ name: 'user', createdAt: now, updatedAt: now }],
          { transaction }
        );

        const [insertedRole] = await queryInterface.sequelize.query(
          "SELECT id FROM roles WHERE name = 'user' ORDER BY id LIMIT 1",
          { transaction }
        );

        defaultRoleId = insertedRole[0].id;
      } else {
        defaultRoleId = roles[0].id;
      }

      await queryInterface.sequelize.query(
        `UPDATE users
         SET "roleId" = :defaultRoleId
         WHERE "roleId" IS NULL
           OR "roleId" NOT IN (SELECT id FROM roles)`,
        {
          replacements: { defaultRoleId },
          transaction,
        }
      );
    });
  },

  async down() {
    // Data backfill is intentionally not reverted.
  },
};
