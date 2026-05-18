'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('refresh_tokens', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      token: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users', // name of the users table
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      expiresAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      // Optionally, add createdAt/updatedAt if you want timestamps:
      // createdAt: {
      //   type: Sequelize.DATE,
      //   allowNull: false,
      //   defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      // },
      // updatedAt: {
      //   type: Sequelize.DATE,
      //   allowNull: false,
      //   defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      // }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('refresh_tokens');
  },
};