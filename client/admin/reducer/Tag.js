import update from 'react-addons-update';

const initialData = {
  sortOrder:[],
  selectedId:null,
  selectedTag: {
    id:null,
    SrNo:null,
    Name:null,
    isValid:false,
    errors:{},
  }
};

const validateTag=(tags)=>{
  let {errors,Name} = tags;
  errors=errors?errors:{};
  let isValid = true;
  if(!Name){
    errors.Name = "Name is required";
    isValid =false;
  }else{
    errors.Name="";
  }
  tags.isValid = isValid;
  return {isValid,errors,...tags};
}

const selectedTag =(state=initialData.selectedTag,action) => {
  switch(action.type) {
   case 'TAGS_SELECTED_SET':
        return validateTag({
          ...state,
          ...action.edit,
        });
        break;
    case 'TAGS_EDIT':
        let newTag=Object.assign({},state.initialData,action.edit);
        newTag = Object.assign(newTag,validateTag(newTag));
        return update(state,{
           $set:newTag
        });
        break;
    case 'TAGS_DEFAULT_PHOTO_EDIT':
            return validateTag({
              ...state,
              ...action.edit,
            });
            break;
    default:
       return state;

  }
}

const Tag=(state=initialData,action) => {
  switch(action.type) {
    case 'TAGS_SELECT':
            return {
              ...state,
              selectedId:action.id
            };
            break;
     case 'TAGS_SELECTED_SET':
          return {
            ...state,
            selectedTag:selectedTag(state.selectedTag,action)
          }
    case 'TAGS_DEFAULT_PHOTO_EDIT':
                return {
                  ...state,
                  selectedTag:selectedTag(state.selectedTag,action)
                }
    break;
    case 'TAGS_SORT_ORDER_EDIT':
      return update(state,{
        sortOrder:{
          [action.index]:{
            SrNo:{
              $set:action.SrNo
            }
          }
        }
      });
      break;
    case 'TAGS_SORT_ORDER_SET':
      return update(state,{
        sortOrder:{
          $set:action.sortOrder
        }
      });
      break;
     default:
           return state;
  }
}

export {initialData};
export default Tag;
