'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        comment: 'Primary key for users'
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        comment: 'User email address'
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
        comment: 'Hashed user password'
      },
      roleId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: 'Foreign key to roles table'
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        comment: 'Record creation timestamp'
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        comment: 'Record update timestamp'
      }
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('users');
  }
};