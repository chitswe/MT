/**
* Created Date 2017/12/19
*/

module.exports=(sequelize,DataTypes)=>{
  var TagBlogPostMapping = sequelize.define('TagBlogPostMapping',{
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    }
  });
  return TagBlogPostMapping;
}
