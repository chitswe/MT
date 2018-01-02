import {graphql,compose} from 'react-apollo';
import gql from 'graphql-tag';
import {default as immutableUpdate} from 'react-addons-update';
import {tagByBlogPostQuery} from './Tag';

const BLOGPOST_QUERY = gql `
  query blogPostQuery($page:Int,$pageSize:Int) {
      BlogPost(page:$page,pageSize:$pageSize) {
        pagination {
          page
          pageSize
          hasMore
          totalRows
          totalPages
        }
        list{
          id
          SrNo
          Title
          AuthorId
          User {
            id
            FullName
          }
          State
          Image
          url
          BriefContent
          Content
          createdAt
          updatedAt
          deletedAt
        }
      }
  }
`;

const blogPostQuery = graphql(BLOGPOST_QUERY,{
  options: (props) => {
    return {
      variables:{
        pageSize:10,
        paranoid:false
      }
    }
  },
  props:({data:{loading,BlogPost,fetchMore}})=> {
    let {pagination} = BlogPost? BlogPost:{};
		let {page,hasMore,pageSize} = pagination?pagination:{};
    return {
      loading,
      BlogPost,
      loadMoreBlogPost:(page)=>{
        return fetchMore({
          variables:{
            page,
            pageSize
          },
          updateQuery:(previousResult,{fetchMoreResult})=>{
            return {
              ...previousResult,
              BlogPost:{
                ...fetchMoreResult.BlogPost,
                list:[...previousResult.BlogPost.list,...fetchMoreResult.BlogPost.list]
              }
            };
          },
        });//end of fetchMore
      }
    }
  }
});


const CREATE_BLOGPOST_MUTATION=gql`
mutation createBlogPost($blogPost:InputBlogPost) {
  createBlogPost(blogPost:$blogPost) {
    id
    SrNo
    Title
    AuthorId
    User {
      id
      FullName
    }
    State
    Image
    url
    BriefContent
    Content
    createdAt
    updatedAt
    deletedAt
  }
}
`;

const createBlogPostMutation = graphql(
  CREATE_BLOGPOST_MUTATION,{
      props:({ownProps,mutate})=>{
      return {
        createBlogPost:(arg)=>{
            arg.updateQueries={
                blogPostQuery:(prev,{mutationResult})=>{
                   let mutatedInstance = mutationResult.data.createBlogPost;
                   if(!mutatedInstance)
                        return prev;
                    let newResult =immutableUpdate(prev,{
                        BlogPost:{
                          list:{
                            $unshift:[mutatedInstance]
                          }
                        }
                    });
                    return newResult;
                }
            };
            return mutate(arg);
        }
      }
    }
  }
);

//updateBlogPost
const UPDATE_BLOGPOST_MUTATION = gql`
mutation updateBlogPost($id:Int!,$blogPost:InputBlogPost){
  updateBlogPost(id:$id,blogPost:$blogPost){
    id
    Title
    SrNo
    Image
    url
    State
    AuthorId
    User{
      id
      FullName
    }
    BriefContent
    Content
  }
}
`;

const updateBlogPostMutation = graphql(
  UPDATE_BLOGPOST_MUTATION,{
    props:({mutate})=>{
      return {
        updateBlogPost:(id,blogPost)=>{
          return mutate({
            variables:{id,blogPost}
          });
        }
      };
    }
  }
);


//BlogPostByIdQuery
const BLOGPOST_BY_ID_QUERY  = gql`
query blogPostByIdQuery($id:Int!){
    BlogPostById(id:$id){
      id
      Title
      SrNo
      Image
      url
      State
      AuthorId
      User {
        id
        FullName
      }
      Tag{
        id
        Name
      }
      BriefContent
      Content
    }
}
`;

const blogPostByIdQuery=graphql(BLOGPOST_BY_ID_QUERY,{
    props({ownProps,data:{refetch,loading,BlogPostById}}){
        return {
            findBlogPostById:refetch,
            loadingBlogPostById:loading,
            BlogPostById
        };
    },
    options:({BlogPost:{id}})=>({
        variables:{id},
        fetchPolicy: 'network-only'
    })
});

//mapping
const MAP_BLOGP0ST_MUTATION = gql`
mutation mapBlogPostToTag($BlogPostId:Int!,$TagId:Int,$TagName:String){
    mapBlogPostToTag(BlogPostId:$BlogPostId, TagId:$TagId ,TagName:$TagName){
        id
        Tag{
              id
              Name
            }
    }
}
`;

// const mapBlogPostToTagMutation = graphql(MAP_BLOGP0ST_MUTATION,{
//     props:({ownProps,mutate})=>{
//       return {
//         mapBlogPostToTag:(arg)=>{
//             arg.updateQueries={
//                 TagByBlogPost:(prev,{mutationResult})=>{
//                    let mutatedInstance = mutationResult.data.mapBlogPostToTag.Tag;
//                    if(!mutatedInstance)
//                         return prev;
//                     let newResult =immutableUpdate(prev,{
//                         TagByBlogPost:{
//                             $unshift:mutatedInstance
//                           }
//                         });
//                     return newResult;
//                 }
//             };
//             return mutate(arg);
//           }
//         }
//       }
//     }
//   );
const mapBlogPostToTagMutation = graphql(MAP_BLOGP0ST_MUTATION,{
    props:({mutate})=>{
        return {
            mapBlogPostToTag:(BlogPostId,TagId,TagName)=>{
                return mutate({
                    variables:{
                        BlogPostId,
                        TagId,
                        TagName
                    },
                    refetchQueries: [`TagByBlogPost`]
                });
            }
        };
    }
});

  const UNMAP_BLOGPOST_MUTATION = gql`
mutation unMapBlogPostToTag($BlogPostId:Int!,$TagId:Int!){
    unMapBlogPostToTag(BlogPostId:$BlogPostId, TagId:$TagId){
        id
        Tag{
                id
                Name
            }
    }
}
`;

const unMapBlogPostToTagMutation = graphql(UNMAP_BLOGPOST_MUTATION,{
    props:({mutate})=>{
        return {
            unMapBlogPostToTag:(BlogPostId,TagId)=>{
                return mutate({
                    variables:{
                        BlogPostId,
                        TagId
                    }
                });
            }
        };
    }
});

//sort Order
const SAVE_SORT_ORDER = gql `
mutation saveSortOrderMutation($blogPost:[InputBlogPost]){
    saveSortOrder(blogPost:$blogPost){
        pagination {
          page
          pageSize
          hasMore
          totalRows
          totalPages
        }
        list{
          id
          SrNo
          Title
          AuthorId
          State
          Image
          url
          BriefContent
          Content
          createdAt
          updatedAt
        }
    }
}
`;

const saveSortOrderMutation = graphql(SAVE_SORT_ORDER,{
    props({mutate}){
        return {
            saveSortOrder:(blogPost)=>{
                return mutate({
                    variables:{
                        blogPost
                    },
                    updateQueries:{
                        blogPostQuery:(prev,{mutationResult})=>{
                            return Object.assign(prev,{BlogPost:mutationResult.data.saveSortOrder});
                        }
                    }
                });
            }
        }
    }
});

/*Sort Order Up*/
const SAVE_SORT_ORDERUP = gql`
mutation saveSortOrderUpMutation($SrNo:Int!){
    saveSortOrderUp(SrNo:$SrNo){
        pagination {
          page
          pageSize
          hasMore
          totalRows
          totalPages
        }
        list{
          id
          SrNo
          Title
          AuthorId
          State
          Image
          url
          BriefContent
          Content
          createdAt
          updatedAt
          deletedAt
        }
    }
}
`;

const saveSortOrderUpMutation = graphql(SAVE_SORT_ORDERUP,{
    props({mutate}){
        return {
            saveSortOrderUp:(SrNo)=>{
                return mutate({
                    variables:{
                        SrNo
                    },
                    updateQueries:{
                        blogPostQuery:(prev,{mutationResult})=>{
                            return Object.assign(prev,{BlogPost:mutationResult.data.saveSortOrderUp});
                        }
                    }
                });
            }
        }
    }
});

/*SORT ORDER DOWN*/
const SAVE_SORT_ORDERDOWN = gql`
mutation saveSortOrderDownMutation($SrNo:Int!){
    saveSortOrderDown(SrNo:$SrNo){
      pagination {
          page
          pageSize
          hasMore
          totalRows
          totalPages
        }
        list{
          id
          SrNo
          Title
          AuthorId
          State
          Image
          url
          BriefContent
          Content
          createdAt
          updatedAt
          deletedAt
      }
    }
}
`;

const saveSortOrderDownMutation = graphql(SAVE_SORT_ORDERDOWN,{
    props({mutate}){
        return {
            saveSortOrderDown:(SrNo)=>{
                return mutate({
                    variables:{
                        SrNo

                    },
                    updateQueries:{
                        blogPostQuery:(prev,{mutationResult})=>{
                            return Object.assign(prev,{BlogPost:mutationResult.data.saveSortOrderDown});
                        }
                    }
                });
            }
        }
    }
});

const DELETE_BLOG_POST_MUTATION = gql`
mutation deleteBlogPost($id:[Int]!) {
  deleteBlogPost(id:$id) {
    pagination {
      page
      pageSize
      hasMore
      totalRows
      totalPages
    }
    list{
      id
      SrNo
      Title
      AuthorId
      User {
        id
        FullName
      }
      State
      Image
      url
      BriefContent
      Content
      createdAt
      updatedAt
      deletedAt
    }
  }
}
`;

const deleteBlogPostMutation = graphql(DELETE_BLOG_POST_MUTATION,{
    props({ownProps,mutate}){
        return{
            deleteBlogPost(id){
                return mutate({
                              variables:{id},
                              updateQueries:{
                                blogPostQuery:(prev,{mutationResult}) => {
                                  return Object.assign(prev,{BlogPost:mutationResult.data.deleteBlogPost})

                                }
                              }
                });
            }
        }
    }
});

const UNDO_DELETE_BLOG_POST_MUTATION = gql`
  mutation undoDeleteBlogPost($id:[Int]!) {
    undoDeleteBlogPost(id:$id){
      pagination {
        page
        pageSize
        hasMore
        totalRows
        totalPages
      }
      list{
        id
        SrNo
        Title
        AuthorId
        User {
          id
          FullName
        }
        State
        Image
        url
        BriefContent
        Content
        createdAt
        updatedAt
        deletedAt
      }
    }
  }
`;

const undoDeleteBlogPostMutation = graphql(UNDO_DELETE_BLOG_POST_MUTATION,{
  props({ownProps,mutate}) {
    return {
      undoDeleteBlogPost:(id) =>{
        return mutate({
          variables:{
            id
          },
          updateQueries:{
            blogPostQuery:(prev,{mutationResult})=>{
              return Object.assign(prev,{BlogPost:mutationResult.data.undoDeleteBlogPost});
            }
          }
        });
      }
    };
  }
});
export {undoDeleteBlogPostMutation,deleteBlogPostMutation,saveSortOrderDownMutation,saveSortOrderUpMutation,saveSortOrderMutation,blogPostQuery,updateBlogPostMutation,createBlogPostMutation,blogPostByIdQuery,mapBlogPostToTagMutation,unMapBlogPostToTagMutation};
