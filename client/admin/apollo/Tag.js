import {graphql,compose} from 'react-apollo';
import gql from 'graphql-tag';
import {default as immutableUpdate} from 'react-addons-update';
//
const UPDATE_TAGS_MUTATION = gql`
mutation updateTag($id:Int!,$tags:InputTag){
  updateTag(id:$id,tags:$tags){
    id
    SrNo
    Name
  }
}
`;

const updateTagMutation = graphql(
  UPDATE_TAGS_MUTATION,{
    props:({mutate})=>{
      return {
        updateTag:(id,tags)=>{
          return mutate({
            variables:{id,tags}
          });
        }
      };
    }
  }
);
//
// const DELETE_TAGS_MUTATION=gql`
// mutation deleteTag($id:Int!,$Tag:String){
//   deleteTag(id:$id,Tag:$Tag){
//     id
//   }
// }
// `;
//
// const deleteTagMutation = graphql(
//   DELETE_TAGS_MUTATION,{
//     props:({mutate})=>{
//       return {
//         deleteTag:(id,Tag)=>{
//           return mutate({
//             variables:{id,Tag},
//             updateQueries:{
//               tagsQuery:(prev,{mutationResult})=>{
//                   let  index = null;
//                   prev.LandingPageTag.list.every((g,i)=>{
//                       if(g.id==mutationResult.data.deleteTag.id){
//                           index = i;
//                           return false;
//                       }else
//                           return true;
//                   });
//
//                   return index != null? immutableUpdate(prev,{
//                     LandingPageTag:{
//                         list:{
//                             $splice:[[index,1]]
//                         }
//                     }
//                   }):prev;
//               }
//           }
//           });
//         }
//       }
//     }
// })
//
const CREATE_TAGS_MUTATION=gql`
mutation createTag($tags:InputTag) {
  createTag(tags:$tags) {
    id
    SrNo
    Name
  }
}
`;

const createTagMutation = graphql(
  CREATE_TAGS_MUTATION,{
      props:({ownProps,mutate})=>{
      return {
        createTag:(arg)=>{
            arg.updateQueries={
                tagsQuery:(prev,{mutationResult})=>{
                   let mutatedInstance = mutationResult.data.createTag;
                    if(!mutatedInstance)
                        return prev;
                    let newResult =immutableUpdate(prev,{
                        Tag:{
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
const TAGS_QUERY = gql `
  query tagsQuery($page:Int,$pageSize:Int) {
      Tag(page:$page,pageSize:$pageSize) {
        pagination {
          page
          pageSize
          hasMore
          totalRows
          totalPages
        }
        list{
          id
          Name
          SrNo
        }
      }
  }
`;

const tagsQuery = graphql(TAGS_QUERY,{
  options: (props) => {
    return {
      variables:{
        pageSize:10
      }
    }
  },
  props:({data:{loading,Tag,fetchMore}})=> {
    let {pagination} = Tag? Tag:{};
		let {page,hasMore,pageSize} = pagination?pagination:{};
    return {
      loading,
      Tag,
      loadMoreTag:(page)=>{
        return fetchMore({
          variables:{
            page,
            pageSize
          },
          updateQuery:(previousResult,{fetchMoreResult})=>{
            return {
              ...previousResult,
              Tag:{
                ...fetchMoreResult.Tag,
                list:[...previousResult.Tag.list,...fetchMoreResult.Tag.list]
              }
            };
          },
        });//end of fetchMore
      }
    }
  }
});


const TAGS_BY_ID_QUERY =gql`
query tagsByIdQuery($id:Int!){
     TagById(id:$id){
      id
      SrNo
      Name
    }
}`;

const tagsByIdQuery = graphql(TAGS_BY_ID_QUERY,{
  options:({selectedId}) =>({
    variables:{id:selectedId},
    skip:!selectedId
  }),
  props:({data:{loading,TagById}}) => {
    return {
      loading,
      TagById
    }
  }
});

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
          Name
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
                        tagsQuery:(prev,{mutationResult})=>{
                            return Object.assign(prev,{Tag:mutationResult.data.saveSortOrderUp});
                        }
                    }
                });
            }
        }
    }
});

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
          Name
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
                        tagsQuery:(prev,{mutationResult})=>{
                            return Object.assign(prev,{Tag:mutationResult.data.saveSortOrderDown});
                        }
                    }
                });
            }
        }
    }
});

const SAVE_SORT_ORDER = gql`
mutation saveSortOrderMutation($tags:[InputTag]){
    saveSortOrder(tags:$tags){
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
          Name
        }
    }
}
`;

const saveSortOrderMutation = graphql(SAVE_SORT_ORDER,{
    props({mutate}){
        return {
            saveSortOrder:(tags)=>{
                return mutate({
                    variables:{
                        tags
                    },
                    updateQueries:{
                        tagsQuery:(prev,{mutationResult})=>{
                            return Object.assign(prev,{Tag:mutationResult.data.saveSortOrder});
                        }
                    }
                });
            }
        }
    }
});

//TagByBlogPostQuery
const TAG_BY_BLOGPOST_QUERY = gql `
query TagByBlogPost($blogPostId:Int){
	TagByBlogPost(blogPostId:$blogPostId){
		id
    Name
	}
}
`;

const tagByBlogPostQuery=graphql(TAG_BY_BLOGPOST_QUERY,{
    props({ownProps,data:{refetch,loading,TagByBlogPost}}){
        return {
            refetch,
            loading,
            TagByBlogPost
        };
    },
    options:({blogPostId})=>({
        variables:{blogPostId},
        fetchPolicy: 'network-only'
    })
});


export {tagsQuery,createTagMutation,updateTagMutation,tagsByIdQuery,saveSortOrderMutation,saveSortOrderDownMutation,saveSortOrderUpMutation,tagByBlogPostQuery};
