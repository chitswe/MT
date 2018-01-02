import React from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import {compose} from 'react-apollo';
import {connect} from 'react-redux';
import LoadingIndicator from '../../../common/LoadingIndicator';
import {createBlogPostMutation} from '../../apollo/BlogPost';
import {fetchQuery} from '../../apollo/User';
import {initialData} from '../../reducer/BlogPost';
import TextField from 'material-ui/TextField';
import BlogPostStateSelectField from '../../../common/BlogPostStateSelectField';
import ImageUploadEditor from './ImageUploadEditor';
import UserNameAutoComplete from '../../../common/UserNameAutoComplete';
class BlogPostCreateDialog extends React.Component {

  constructor() {
    super(...arguments);
    this.state={
      busy:false,
      busyMessage:'',
      errorText:''
    };
  }

  componentWillReceiveProps(nextProps){
    let {User} = nextProps
    User =  User ? User : [];
    if(User !== this.props.Users) {
      this.props.editAuthorList(User);
    }
  }
  saveBlogPost(closeAfter=true) {
    let {selectedBlogPost,createBlogPost,onRequestClose,showSnackbar} = this.props;
    let {isValid,uploading,id,Title,State,Image,AuthorId,BriefContent,Content,SrNo}  = selectedBlogPost ? selectedBlogPost :{};
    //  Image = Image ? Image : "";
    //  Content = Content ? Content : "";
    if(uploading) {
      showSnackbar("BlogPost is still uploading!.Please wait");
      return;
    }
   if(isValid) {
      this.setState({busy:true,busyMessage:'Create new BlogPost',errorText:''});
      createBlogPost({
        variables:{
          blogPost:{
            Title,
            Image,
            AuthorId,
            State,
            BriefContent,
            Content
         }
        }
      })
      .then(()=>{
        this.setState({busy:false,busyMessage:'',errorText:''});
        showSnackbar('New BlogPost created!');
        this.props.editBlogPost(initialData.selectedBlogPost);
        onRequestClose();

      }).catch(error=>{
        console.log(error);
        this.setState({busy:false,busyMessage:'',errorText:error});
      });
    }
  }

  render() {
    let {AuthorList,selectedBlogPost,isOpen,onRequestClose,editBlogPost} = this.props;
    let {Title,State,BriefContent,url,uploading,Content,errors,}  = selectedBlogPost ? selectedBlogPost : {};
    let {busy,busyMessage,errorText}= this.state;
    let dialogActions = [
      <FlatButton label="Cancel" primary={true} onTouchTap={onRequestClose}/>,
      <FlatButton label="OK" primary={true} onTouchTap={this.saveBlogPost.bind(this)}/>
    ];

    return (
      <Dialog open={isOpen} actions={dialogActions} modal={true} title="Create new BlogPost" onTouchTap={onRequestClose}>
      <div className="row" style={{backgroundColor:'#fff',textAlign:'center'}}>
          <div style={{padding:'20px 0',flexGrow:1}}>
              <TextField hintText="Title" ref="Title" floatingLabelText="Title" name="Title" id="Title" errorText={errors.Title} value={Title} onChange={(e)=>{this.props.editBlogPost({Title:e.target.value});}}/>
              <br/>
              <BlogPostStateSelectField
                style={{textAlign:'left'}}
                id="BlogPostState"
                name="BlogPostState"
                value={State}
                errorText={errors.State}
                onChange={(e,index,value)=>{
                   this.props.editBlogPost({State:value})
                }}
                floatingLabelText="State"
                hintText="State"
              />
              <br/>
              <UserNameAutoComplete id="Author NameAutoComplete" name="autoComplete" hintText="Search fine type" floatingLabelText="Search Author Name" openOnFocus={false} UserList={AuthorList} onNewRequest={item=>{this.props.editBlogPost({AuthorId:item.id})}}/>
              <br/>
          </div>
          <div style={{flexGrow:1}}>
              <TextField style={{width:'300px',textAlign:'left'}} id="BriefContent" multiLine={true} rows={5} floatingLabelText="BriefContent" errorText={errors.BriefContent} value={BriefContent} onChange={(e)=>{this.props.editBlogPost({BriefContent:e.target.value});}}/>
              <br/>
              <ImageUploadEditor/>
          </div>
      </div>
    </Dialog>
    );
  }
}
export default
compose(
   connect(
     state=>({selectedBlogPost:state.BlogPost.selectedBlogPost,AuthorList:state.BlogPost.AuthorList}),
     dispatch=>({

       editBlogPost:(edit)=>{
         dispatch({type:'BLOGPOST_SELECTED_SET',edit});
       },
       showSnackbar:(message)=>{
         dispatch({type:'ADMIN_SITE_SNACKBAR_OPEN',message});
       },
       defaultPhotoEdit:(DefaultPhoto)=>{
         dispatch({type:'BLOGPOST_DEFAULT_PHOTO_EDIT',DefaultPhoto});
      },
      editAuthorList:(list)=>{
        dispatch({type:'FETCH_USER_LIST',list});
      }
     })
   ),
   createBlogPostMutation,
   fetchQuery
)(BlogPostCreateDialog);
