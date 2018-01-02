import db from '../models/index';
import property from 'lodash';
import PaginationHelper from '../database/PaginationHelper';
import cloudinary from '../cloudinary';

export const type=`
type BlogPost {
  id:Int!
  Title:String!
  User:User
  Tag:[Tag]
  AuthorId:Int!
  Image:String
  url:String
  State:Int
  BriefContent:String!
  Content:String
  createdAt:DateTime
  updatedAt:DateTime
  deletedAt:DateTime
  SrNo:Int
}

type BlogPostList {
  pagination : pagination
  list :[BlogPost]
}

input InputBlogPost {
  id:Int
  Title:String!
  SrNo:Int
  AuthorId:Int!
  State:Int
  Image:String
  BriefContent:String!
  Content:String
}
`;

export const query = `
BlogPost(page:Int,pageSize:Int,search:String,paranoid:Boolean):BlogPostList
BlogPostById(id:Int!):BlogPost
`
;

export const mutation = `
 createBlogPost(blogPost:InputBlogPost):BlogPost
 updateBlogPost(id:Int!,blogPost:InputBlogPost):BlogPost
 mapBlogPostToTag(BlogPostId:Int!,TagId:Int,TagName:String):BlogPost
 unMapBlogPostToTag(BlogPostId:Int!,TagId:Int!):BlogPost

 saveSortOrder(blogPost:[InputBlogPost]):BlogPostList
 saveSortOrderDown(SrNo:Int!):BlogPostList
 saveSortOrderUp(SrNo:Int!):BlogPostList

 deleteBlogPost(id:[Int]!):BlogPostList,
 undoDeleteBlogPost(id:[Int]!):BlogPostList
`;

export const resolver = {
  type :{
    BlogPost:{
      id:property("id"),
      Title:property("Title"),
      AuthorId:property("AuthorId"),
      Image:property("Image"),
      url:(value)=>(value.Image? cloudinary.url(value.Image): null),
      State:property("State"),
      BriefContent:property("BriefContent"),
      Content:property("Content"),
      createdAt:property("createdAt"),
      updatedAt:property("updatedAt"),
      User(blogPost) {
        return blogPost.getUser();
      },
      Tag(blogPost) {
        return db.sequelize.query(`SELECT * FROM "Tag" WHERE "id" IN (SELECT DISTINCT "TagId" FROM "TagBlogPostMapping" AS M INNER JOIN "Tag" AS V ON V."id" = M."TagId" WHERE "BlogPostId"=$BlogPostId)`,{
            model:db.Tag,
            bind:{BlogPostId:blogPost.id}
        }).then(result=>{
            return result.map(s=>{
                return blogPost.getTags({where:{id:s.id}}).then(Value=>{
                    s.Value = Value;
                    return s;
                });
            });
        });
      },
      SrNo:property("SrNo")
    }
  },
  query:{
    BlogPost(_,{page,pageSize,search,paranoid},context){
      page = !page ? 1:page;
      pageSize = !pageSize? 10 : pageSize;
      let offset = (page-1)*pageSize;
      const where = search ? {
        Tag : {
          $iLike:`%${search}`
        }
      }:null
        //return PaginationHelper.getResultWithPagination({db,baseQuery:db.BlogPost,page,pageSize,where,listKey:"list",include:[{model:db.Tag},through:{attributes:['createdAt','updatedAt','TagId','BlogPostId','id']}],order:['id','Name']})
        return PaginationHelper.getResultWithPagination({db,baseQuery:db.BlogPost,page,pageSize,where,listKey:"list",paranoid,order:['id']})
    },
    BlogPostById(_,{id}) {
      return db.BlogPost.findById(id);
    }
  },
  mutation:{
    createBlogPost(_,{blogPost},context) {
      return db.sequelize.transaction(t=>{
        return db.BlogPost.create(blogPost,{transaction:t,fields:['Title','Image','State','AuthorId','BriefContent','Content']});

      });
    },
    updateBlogPost(_,{id,blogPost},context) {
        return db.sequelize.transaction(t=>{
            return db.BlogPost.findById(id,{transaction:t})
            .then(i=>{
              if(!i)
                  throw "BlogPost not found"
              else {
                return i.update(blogPost,{transaction:t,fields:['Title','Image','AuthorId','BriefContent','Content','State']});
              }
            })
        });
    },
    mapBlogPostToTag(_,{BlogPostId,TagId,TagName}){
      let Name = TagName;
      return db.sequelize.transaction(t=>{
      if(!TagId){
        return db.Tag.findOrCreate({where:TagName ? {Name:{$iLike:`%${TagName}%`}} : true,defaults:{Name}}).spread((instance,created)=>{
              if(!created)
                return null;
              TagId = instance.get('id');
              return instance
         }).then((newTag)=>{
             if(!newTag) return null;
             return db.BlogPost.findById(BlogPostId,{transaction:t}).then((blogPost)=>{
                 return newTag.addBlogPost(blogPost,{transaction:t}).then(()=>(blogPost));
             })
          })
          }else {
              return db.Tag.findById(TagId,{transaction:t})
              .then(tags=>{
                  if(!tags)
                      return null;
                  return db.BlogPost.findById(BlogPostId,{transaction:t})
                      .then(blogPost=>{
                          if(!blogPost)
                              return null;
                          return tags.addBlogPost(blogPost,{transaction:t}).then(()=>(blogPost));
                      });
              });
            }

        });
    },
    unMapBlogPostToTag(_,{BlogPostId,TagId}){
        return db.sequelize.transaction(t=>{
            return db.Tag.findById(TagId,{transaction:t})
            .then(tags=>{
                if(!tags)
                    return null;
                return db.BlogPost.findById(BlogPostId,{transaction:t})
                    .then(blogPost=>{
                        if(!blogPost)
                            return null;
                        return tags.removeBlogPost(blogPost,{transaction:t}).then(()=>(blogPost));
                    });
            });
        });
    },//start of sort Order
    saveSortOrder:(_,{blogPost})=>{
        return db.sequelize.transaction(t=>{
            const promises = blogPost.map(({id,SrNo})=>{
                return db.BlogPost.update({SrNo},{transaction:t,fields:['SrNo'], where:{id}});
            });
            return Promise.all(promises);
        }).then(()=>{
            return resolver.query.BlogPost(_,{page:1,pageSize:10});
        });
    },
    saveSortOrderUp(_,{SrNo}){
          return db.sequelize.transaction(t=>{
                return db.BlogPost.update({SrNo:SrNo-1},{transaction:t,fields:['SrNo'],where:{SrNo:{$lte:SrNo}}});
              }).then(()=>{
                  return resolver.query.BlogPost(_,{page:1,pageSize:10});
          });
    },
    saveSortOrderDown(_,{SrNo}){
        return db.sequelize.transaction(t=>{
              return db.BlogPost.update({SrNo:SrNo+1},{transaction:t,fields:['SrNo'],where:{SrNo:{gte:SrNo}}});
            }).then(()=>{
                return resolver.query.BlogPost(_,{page:1,pageSize:10});
        });
    },
    deleteBlogPost(_,{id},context) {
      return db.sequelize.transaction((t)=>{
        const promises = id.map((i)=>{
          return db.sequelize.query(`UPDATE "BlogPost" SET "Title" = "Title" || '(Deleted)'::character varying where "id" = $i AND "deletedAt" is null`,{
            bind:{i},
            transaction:t
          }).then(()=>{
            return db.BlogPost.destroy({where:{id:id},transaction:t}).then((rowDeleted)=>{
              if(rowDeleted > 0)
                return db.BlogPost.findById(i,{paranoid:false, transaction:t});
              else {
                return null;
              }
            })
          })
        });
        return Promise.all(promises);
      }).then(()=>{
        return resolver.query.BlogPost(_,{page:1,pageSize:10,paranoid:false});
      })
    },
    undoDeleteBlogPost(_,{id},context) {
      return db.sequelize.transaction((t)=>{
        const promises = id.map((i)=>{
          return db.sequelize.query(`Update "BlogPost" SEt "Title"=REPLACE("Title",'(Deleted)','') where "id" = $i AND "deletedAt" is not null`,{
            bind:{i},
            transaction:t
          }).then(()=>{
            db.BlogPost.update({deletedAt:null},{paranoid:false,where:{id:i},returning:true,fields:['deletedAt'],transaction:t});
          })
        });
        return Promise.all(promises);
      }).then(()=>{
        return resolver.query.BlogPost(_,{page:1,pageSize:10,paranoid:false});
      });
    }
  }
}
;
