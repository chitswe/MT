'use strict';
const models = require ('../../models/index');
module.exports = {
  up: function (queryInterface, Sequelize) {
   return queryInterface.sequelize.transaction(t=>{
     return models.UserAccount.create({
       UserName:'Admin'
     },{
       fields:['UserName'],
       transaction:t
     }).then(userAccount=>{
       return userAccount.createUser({
        FullName:'Administrator',
       },{
         fields:['FullName'],transaction:t
       });
     });
   });
  },

  down: function (queryInterface, Sequelize) {
  return models.UserAccount.destroy({truncate:true,cascade:true});
  }
};
