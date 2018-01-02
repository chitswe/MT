'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('TagBlogPostMapping',{
      id:{
        type:Sequelize.INTEGER,
        primaryKey:true,
        autoIncrement:true
      },
      createdAt:Sequelize.DATE,
      updatedAt:Sequelize.DATE,
      TagId:{
        type:Sequelize.INTEGER,
        allowNull:false,
        references:{
          model:'Tag',
          key:'id'
        }
      },
      BlogPostId:{
        type:Sequelize.INTEGER,
        allowNull:false,
        references:{
          model:'BlogPost',
          key:'id'
        }
      }
    })
  },

  down: function (queryInterface, Sequelize) {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
  }
};
