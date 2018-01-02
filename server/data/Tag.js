import db from '../models/index';
import property from 'lodash';
import PaginationHelper from '../database/PaginationHelper';

export const type=`
  type Tag {
    id:Int!
    SrNo:Int
    Name:String

  }

  type TagList {
    pagination:pagination
    list:[Tag]
  }

  input InputTag{
    id:Int
    SrNo:Int
    Name:String
  }
`;

export const query=`
 Tag(page:Int,pageSize:Int,search:String):TagList
 TagById(id:Int!):Tag
 TagByBlogPost(blogPostId:Int):[Tag]

`;

export const mutation=`
  createTag(tags:InputTag):Tag
  updateTag(id:Int!,tags:InputTag):Tag
  deleteTag(id:Int!,Tag:String):Tag
  saveSortOrderUp(SrNo:Int!):TagList
  saveSortOrderDown(SrNo:Int!):TagList
  saveSortOrder(tags:[InputTag]):TagList
`;

export const resolver={
  type:{
    Tag:{
      id:property("id"),
      Name:property("Name"),
      SrNo:property("SrNo")
    }
  },
  query:{
    Tag(_,{page,pageSize,search},context){
      page = !page ? 1:page;
      pageSize = !pageSize? 10 : pageSize;
      let offset = (page-1)*pageSize;
      const where = search ? {
        Tag : {
          $iLike:`%${search}`
        }
      }:null
        return PaginationHelper.getResultWithPagination({db,baseQuery:db.Tag,page,pageSize,where,listKey:"list",order:['id','Name']})
    },
    TagById(_,{id}){
      return db.Tag.findById(id);
    },
    TagByBlogPost(_,{blogPostId}){
			// return db.sequelize.query(`SELECT * from "Tag" WHERE "id" IN (Select "TagId" from "TagBlogPostMapping"  where "BlogPostId" IN (select "BlogPostId" from "TagBlogPostMapping" WHERE "BlogPostId"=${blogPostId}))`,{
			// 	bind:{blogPostId:blogPostId? blogPostId: null},
			// 	model:db.Tag
			// });
      return db.Tag.findAll({order:[['id','DESC']]})
		},
  },
    mutation:{
      createTag(_,{tags},context) {
        return db.sequelize.transaction(t=>{
          return db.Tag.create(tags,{transaction:t,fields:['Name']});
        });
      },
      updateTag(_,{id,tags},context) {
          return db.sequelize.transaction(t=>{
              return db.Tag.findById(id,{transaction:t})
              .then(i=>{
                if(!i)
                    throw "Tag not found"
                else {
                  return i.update(tags,{transaction:t,fields:['Name']});
                }
              })
          });
      },
      deleteTag(_,{id,Tag},context){
        return db.sequelize.transaction(t=>{
          return db.Tag.destroy({where:{id:id},transaction:t})
            .then(()=>{
              return null;
                });
            });
      },
      saveSortOrderUp(_,{SrNo}){
            return db.sequelize.transaction(t=>{
                  return db.Tag.update({SrNo:SrNo-1},{transaction:t,fields:['SrNo'],where:{SrNo:{$lte:SrNo}}});
                }).then(()=>{
                    return resolver.query.Tag(_,{page:1,pageSize:10,paranoid:false});
            });
      },
      saveSortOrderDown(_,{SrNo}){
          return db.sequelize.transaction(t=>{
                return db.Tag.update({SrNo:SrNo+1},{transaction:t,fields:['SrNo'],where:{SrNo:{gte:SrNo}}});
              }).then(()=>{
                  return resolver.query.Tag(_,{page:1,pageSize:10,paranoid:false});
          });
      },
      saveSortOrder:(_,{tags})=>{
          return db.sequelize.transaction(t=>{
              const promises = tags.map(({id,SrNo})=>{
                  return db.Tag.update({SrNo},{transaction:t,fields:['SrNo'], where:{id}});
              });
              return Promise.all(promises);
          }).then(()=>{
              return resolver.query.Tag(_,{page:1,pageSize:10,paranoid:false});
          });
      }
    }//end of mutation
  }
;
