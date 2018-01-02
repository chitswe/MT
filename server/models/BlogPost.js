/**
* Created Date 2017/12/19
*/

module.exports=(sequelize,DataTypes)=>{
  var BlogPost = sequelize.define('BlogPost',{
   SrNo:DataTypes.INTEGER,
    Title :{
        type:DataTypes.STRING(250),
        allowNull:false,
        validate:{
        notEmpty:{
          msg:'Title is required'
        },
        len:{
          args:[[0,250]],
          msg:"Need to be less than 250 chars long."
        }
        }
      },
    State:{
     type:DataTypes.INTEGER,
     allowNull:false,
     validate:{
     notEmpty:{
       msg:'State is required'
     },
     }
   },
   Image:{
     type:DataTypes.STRING(255),
     allowNull:true,
     validate:{
       len:{
         args:[[0,255]],
         msg:"Image is less than 50"
       }
     }
   },
   BriefContent:{
     type:DataTypes.TEXT,
     allowNull:false,
     validate:{
       notEmpty:{
         msg:"Brief Content is required."
       }
     }
   },
   Content:{
      type:DataTypes.TEXT,
      allowNull:true,
   }
 },{
   paranoid:true,
   classMethods:{
     associate:(models)=>{
       models.User.hasMany(models.BlogPost,{foreignKey:'AuthorId'});
       models.BlogPost.belongsTo(models.User,{foreignKey: 'AuthorId'});
     }
   }
 });
  return BlogPost;
}
