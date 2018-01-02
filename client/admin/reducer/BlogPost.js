import update from 'react-addons-update';

const initialData = {
  sortOrder:[],
  sortOrderActiveIndex:null,
  currentOrderNo:null,

  AuthorList:[],
  selectedId:null,
  selectedBlogPost: {
    id:null,
    SrNo:null,
    Title:null,
    State:null,
    Image:null,
    BriefContent:null,
    AuthorId:null,
    Content:null,
    uploading:false,
    isValid:false,
    errors:{},
    User:null,
    url:'',
    Format:'',
    selected:[],
    selectedTagId:null
  },
  MapOfTag:[],


};

const validateSelectedTagId = (blogPost)=>{
    let {errors,selectedTagId} = blogPost;
    errors=errors?errors:{};
    let isValid = true;
    if(!selectedTagId){
      errors.selectedTagId = "Not Found TagId";
      isValid =false;
    }else{
      errors.selectedTagId="";
    }
}
const validateBlogPost=(blogPost)=>{
  let {errors,Title,State,Image,BriefContent,Content} = blogPost;
  errors=errors?errors:{};
  let isValid = true;
  if(!Title){
    errors.Title = "Name is required";
    isValid =false;
  }else{
    errors.Title="";
  }
  if(State === null || State === undefined || State === NaN){
    errors.State = "State is required";
    isValid =false;
  }else{
    errors.State="";
  }
  if(!BriefContent){
    errors.BriefContent = "BriefContent is required";
    isValid =false;
  }else{
    errors.BriefContent="";
  }

  blogPost.isValid = isValid;
  return {isValid,errors,...blogPost};
}

const selectedBlogPost =(state=initialData.selectedBlogPost,action) => {
  switch(action.type) {
   case 'BLOGPOST_SELECTED_SET':
        return validateBlogPost({
          ...state,
          ...action.edit,
        });
        break;
     case 'BLOGPOST_TAGID_SELECTED_SET':
           return validateSelectedTagId({
             ...state,
             ...action.edit,
           });
           break;
    case 'BLOGPOST_EDIT':
        let newBlogPost=Object.assign({},state.initialData,action.edit);
        newBlogPost = Object.assign(newBlogPost,validateBlogPost(newBlogPost));
        return update(state,{
           $set:newBlogPost
        });
        break;
    case 'BLOGPOST_DEFAULT_PHOTO_EDIT':
            return validateBlogPost({
              ...state,
              ...action.edit,
            });
        break;
    default:
       return state;
  }
}

const BlogPost=(state=initialData,action) => {
  switch(action.type) {
    case 'BLOGPOST_SELECT_ID':
            console.log("testing"+action.id);
            return {
              ...state,
              selectedId:action.id
            };
            break;
     case 'BLOGPOST_SELECTED_SET':
          return {
            ...state,
            selectedBlogPost:selectedBlogPost(state.selectedBlogPost,action)
          }
          break;
    case 'BLOGPOST_TAGID_SELECTED_SET':
          return {
            ...state,
            selectedBlogPost:selectedBlogPost(state.selectedBlogPost,action)
          }
          break;
    case 'BLOGPOST_DEFAULT_PHOTO_EDIT':
                return {
                  ...state,
                  selectedBlogPost:selectedBlogPost(state.selectedBlogPost,action)
                }
    break;
    case 'BLOGPOST_SORT_ORDER_EDIT':
      return update(state,{
        sortOrder:{
          [action.index]:{
            SrNo:{
              $set:action.SortOrder
            }
          }
        }
      });
      break;
    case 'BLOGPOST_SORT_ORDER_SET':
      return update(state,{
        sortOrder:{
          $set:action.sortOrder
        }
      });
      break;
    case 'BLOGPOST_SELECTED_ITEM':
             return update(state,{
               selectedBlogPost:{
                 selected: {
                   $set:action.selected
                 }
               }
           });
     break;
     case 'ADD_TAG_OF_BLOGPOST':
            return update (state,{
              MapOfTag:{
                $set:action.edit
              }
            })
      break;
      case 'BLOGPOST_SORT_ORDER_SET':
        return update(state,{
          sortOrder:{
            $set:action.sortOrder
          }
        });
        break;
      case 'BLOGPOST_SORT_ORDER_INDEX_SELECT':
      		return update(state,{
      			sortOrderActiveIndex:{
      					$set:action.index
      				}
      			});
      			break;
        case 'BLOGPOST_SORT_ORDER_SELECT':
        			return update(state,{
        				currentOrderNo:{
        					$set:action.SortOrder
        				}
        			});
        			break;
        case 'FETCH_USER_LIST' :
              return update(state,{
                AuthorList:{
                  $set:action.list
                }
              })
        break;
     default:
           return state;
  }
}

export {initialData};
export default BlogPost;
