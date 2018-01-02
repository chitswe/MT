import React from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import {compose} from 'react-apollo';
import {connect} from 'react-redux';
import LoadingIndicator from '../../../common/LoadingIndicator';
import {createBlogPostMutation} from '../../apollo/BlogPost';
//import {initialData} from '../../reducer/BlogPost';
import TextField from 'material-ui/TextField';
import BlogPostStateSelectField from '../../../common/BlogPostStateSelectField';
import Dropzone from 'react-dropzone';
import PhotoManager from '../../../../common/PhotoManager';

class BlogPostTagEditDialog extends React.Component {

  constructor() {
    super(...arguments);
    this.state={
      busy:false,
      busyMessage:'',
      errorText:''
    };
  }

  saveBlogPost(closeAfter=true) {
    let {selectedBlogPost,createBlogPost,onRequestClose,showSnackbar} = this.props;
    let {isValid,uploading,id,Title,State,Image,AuthorId,BriefContent,Content,SrNo}  = selectedBlogPost ? selectedBlogPost :{};
    AuthorId =  AuthorId ? AuthorId : 1;
  //  Image = Image ? Image : "";
//    Content = Content ? Content : "";
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
    //    this.props.editBlogPost(initialData.selectedBlogPost);

      }).catch(error=>{
        console.log(error);
        this.setState({busy:false,busyMessage:'',errorText:error});
      });
    }
  }

  onImageDrop(files){
      let {defaultPhotoEdit,showSnackbar,onImageUploadComplete} = this.props;
      defaultPhotoEdit({url:files[0].preview,uploading:true});
      PhotoManager.BlogPost.upload(files[0])
          .then(({secure_url,format,public_id})=>{
              defaultPhotoEdit({Format:format,FileName:public_id,url:secure_url,uploading:false});
              onImageUploadComplete();
              showSnackbar('Product photo has been uploaded.');
          }).catch((error)=>{
              defaultPhotoEdit({uploading:false});
              showSnackbar(`Could not upload photo. ${error}`);
          });
  }

  render() {
    let {selectedBlogPost,isOpen,onRequestClose,editBlogPost} = this.props;
    let {Title,State,BriefContent,url,uploading,Content,errors}  = selectedBlogPost ? selectedBlogPost : {};
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
              <br/>
          </div>
          <div style={{flexGrow:1}}>
              <TextField style={{width:'300px',textAlign:'left'}} id="BriefContent" multiLine={true} rows={5} floatingLabelText="BriefContent" errorText={errors.BriefContent} value={BriefContent} onChange={(e)=>{this.props.editBlogPost({BriefContent:e.target.value});}}/>
              <br/>
              <Dropzone
                      style={{margin:'0 auto',border:'1px dotted',width:'200px'}}
                      multiple={false}
                      accept="image/*"
                      onDrop={this.onImageDrop.bind(this)}>
                      <div>Drop an image or click to select a file to upload.</div>
                      <img style={{width:'150px',height:'150px'}} src={url}/>
                      {uploading? <CircularProgress />:null}
              </Dropzone>
          </div>
      </div>
    </Dialog>
    );
  }
}
export default
compose(
   connect(
     state=>({selectedBlogPost:state.BlogPost.selectedBlogPost}),
     dispatch=>({

       editBlogPost:(edit)=>{
         dispatch({type:'BLOGPOST_SELECTED_SET',edit});
       },
       showSnackbar:(message)=>{
         dispatch({type:'ADMIN_SITE_SNACKBAR_OPEN',message});
       },
       defaultPhotoEdit:(DefaultPhoto)=>{
         dispatch({type:'BLOGPOST_DEFAULT_PHOTO_EDIT',DefaultPhoto});
      }
     })
   ),
   createBlogPostMutation
)(BlogPostTagEditDialog);
