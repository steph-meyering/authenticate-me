'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Items', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      accessToken: {
        type: Sequelize.STRING,
        allowNull: false
      },
      itemId: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      userExternalId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'externalId'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      institutionId: {
        type: Sequelize.STRING
      },
      institutionName: {
        type: Sequelize.STRING
      },
      webhook: {
        type: Sequelize.STRING
      },
      error: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('NOW()')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('NOW()')
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Items');
  }
};
