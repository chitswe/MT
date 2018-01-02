/**
* Created Date 2017/12/19
*/

module.exports=(sequelize,DataTypes)=>{
  var Tag = sequelize.define('Tag',{
    SrNo:DataTypes.INTEGER,
    Name: {
      type:DataTypes.STRING(50),
      allowNull:false,
      validate:{
        notEmpty:{
          msg:'Name is required'
        },
        len:{
          args:[[0,50]],
          msg:'Need to be less than 50 chars long.'
        }
      }
    }
  },{
    classMethods:{
    associate:(models) => {
    Tag.belongsToMany(models.BlogPost,{through:'TagBlogPostMapping'});
    models.BlogPost.belongsToMany(Tag,{through:'TagBlogPostMapping'});
    }
    }
    });
  return Tag;
}
