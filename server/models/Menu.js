/**
Created Date 2017/12/19
*/

module.exports = (sequelize,DataTypes)=>{
  var Menu = sequelize.define('Menu',{
    Name: {
      type:DataTypes.STRING(150),
      allowNull:false,
      validate:{
        notEmpty:{
          msg:'Name is required'
        },
        len:{
          args:[[0,50]],
          msg:'Need to be less than 150 chars long'
        }
      }
    },
    ParentMenuId: {
      type:DataTypes.INTEGER
    }
  },{
     paranoid:true,
     classMethods:{
       associate:(models)=>{
         Menu.belongsTo(models.Menu,{as:'ParentMenu',foreignKey:'ParentMenuId'});
         Menu.hasMany(models.Menu,{as:'ChildMenu',foreignKey:'ParentMenuId'});
       }
       }
     });
  return Menu;
}
