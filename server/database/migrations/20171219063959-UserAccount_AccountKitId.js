'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.addColumn("UserAccount","AccountKitId",{
      type:Sequelize.BIGINT
    });
  },

  down: function (queryInterface, Sequelize) {
  queryInterface.removeColumn("UserAccount","AccountKitId");
  }
};
