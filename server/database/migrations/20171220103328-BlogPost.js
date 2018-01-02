'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
   queryInterface.createTable('BlogPost',{
     id:{
       type:Sequelize.INTEGER,
       primaryKey:true,
       autoIncrement:true,
       allowNull:false
     },
     SrNo: {
       type: Sequelize.INTEGER
     },
     Title:{
      type:Sequelize.STRING(250),
      allowNull:false
     },
     State:{
       type:Sequelize.INTEGER,
       allowNull:false
     },
     Image:{
      type:Sequelize.STRING(255),
      allowNull:true
    },
     BriefContent:{
      type:Sequelize.TEXT,
      allowNull:false
    },
     Content:{
       type:Sequelize.TEXT,
       allowNull:true
     },
     AuthorId:{
      type:Sequelize.INTEGER,
      references:{
        model:'User',
        key:'id'
      }
    },
    createdAt:{
      type:Sequelize.DATE
    },
    updatedAt:{
      type:Sequelize.DATE
    },
    deletedAt:{
      type:Sequelize.DATE
    }
   })
  },

  down: function (queryInterface, Sequelize) {
    queryInterface.dropTable('BlogPost');
  }
};
