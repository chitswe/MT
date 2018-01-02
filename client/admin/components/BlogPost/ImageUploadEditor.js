import React from 'react';
import {compose} from 'react-apollo';
import {connect} from 'react-redux';
import Dropzone from 'react-dropzone';
import PhotoManager from '../../../../common/PhotoManager';
import CircularProgress from 'material-ui/CircularProgress';

class ImageUploadEditor extends React.Component {

onImageDrop(files) {
let {defaultPhotoEdit,showSnackbar} = this.props;
defaultPhotoEdit({Image:files[0].preview,uploading:true});
PhotoManager.BlogPost.upload(files[0])
 .then(({secure_url,format,public_id})=>{
   console.log(public_id)
   console.log(secure_url)
   defaultPhotoEdit({Format:format,Image:public_id,url:secure_url,uploading:false});
   showSnackbar('Photo has been uploaded.');
 }).catch((error)=>{
   defaultPhotoEdit({uploading:false});
   showSnackbar(`Could not upload photo. ${error}`);
 });
}

render() {
    let {selectedBlogPost} = this.props;
    let {url,uploading,errors} = selectedBlogPost ? selectedBlogPost : {}
    return (
      <Dropzone
              style={{margin:'0 auto',border:'1px dotted',width:'200px'}}
              multiple={false}
              accept="image/*"
              onDrop={this.onImageDrop.bind(this)}>
              <div>Drop an image or click to select a file to upload.</div>
              <img style={{width:'150px',height:'150px'}} src={url}/>
              {uploading? <CircularProgress />:null}
      </Dropzone>
    )

  }

}

export default compose(
  connect(
    state => ({selectedBlogPost:state.BlogPost.selectedBlogPost}),
    dispatch => ({
      editBlogPost:(edit)=>{
        dispatch({type:'BLOGPOST_SELECTED_SET',edit});
      },
      showSnackbar:(message)=>{
        dispatch({type:'ADMIN_SITE_SNACKBAR_OPEN',message});
      },
      defaultPhotoEdit:(edit)=>{
        dispatch({type:'BLOGPOST_DEFAULT_PHOTO_EDIT',edit});
     }
    })
  )
)
(ImageUploadEditor);
