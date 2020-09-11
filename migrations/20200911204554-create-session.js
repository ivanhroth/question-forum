'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('session', {
      sid: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING
      },
      sess: {
        type: Sequelize.JSON
      },
      expire: {
        type: Sequelize.DATE(6),
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('session');
  }
};
