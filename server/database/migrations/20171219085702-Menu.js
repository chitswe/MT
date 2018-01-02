'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.createTable('Menu',{
      id:{
        type:Sequelize.INTEGER,
        primaryKey:true,
        autoIncrement:true
      },
      Name:{
        type:Sequelize.STRING(150),
        allowNull: false,
        validate:{
          notEmpty:{
            msg:'Name is required'
          }
        }
      },
      ParentMenuId:{
        type:Sequelize.INTEGER,
        references:{
          model:'Menu',
          key:'id'
        }
      },
      createdAt:{
        type: Sequelize.DATE
      },
      updatedAt:{
        type: Sequelize.DATE
      },
      deletedAt:{
        type: Sequelize.DATE
      }
    })
  },

  down: function (queryInterface, Sequelize) {
  queryInterface.dropTable("Menu");
  }
};
