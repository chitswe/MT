'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.createTable('Tag',{
      id:{
        type: Sequelize.INTEGER,
        primaryKey:true,
        autoIncrement:true
      },
      SrNo:{
        type: Sequelize.INTEGER
      },
      Name:{
        type:Sequelize.STRING(50),
        allowNull:false,
      },
      createdAt:{
        type:Sequelize.DATE
      },
      updatedAt:{
        type:Sequelize.DATE
      }

    })
  },

  down: function (queryInterface, Sequelize) {

  }
};
