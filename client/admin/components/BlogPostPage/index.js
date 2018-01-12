import React from 'react';
import {Card,CardHeader,CardActions,CardText} from 'material-ui/Card';
import Dropzone from 'react-dropzone';
import FlatButton from 'material-ui/FlatButton';
import {blogPostByIdQuery,updateBlogPostMutation}  from '../../apollo/BlogPost';
import {compose} from 'react-apollo';
import {connect} from 'react-redux';
import LoadingIndicator from '../../../common/LoadingIndicator';
import AppBar from './AppBar';
import BlogPostTagMapper from './BlogPostTagMapper';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import BlogPostStateSelectField from '../../../common/BlogPostStateSelectField';
import ImageUploadEditor from '../BlogPost/ImageUploadEditor';
import EditorAttachFile from 'material-ui/svg-icons/editor/attach-file';
import IconButton from 'material-ui/IconButton';

class BlogPostPage extends React.Component{
	constructor(){
		super(...arguments);
		this.state={
		generalInfo:{
		busy:false,
		busyMessage:'',
		errorText:''
		},
		isOverviewEditorOpen:false
		};
	}
componentDidMount() {
 let {BlogPostById} = this.props;
 this.updateStore(BlogPostById);
}

updateStore(blogPost)  {
	let {editBlogPost} = this.props;
	editBlogPost(blogPost);
}
componentWillReceiveProps(nextProps){

		let {BlogPostById,editBlogPost,ArrOfTag,pushTag} = nextProps
		let {Title,Image,State,AuthorId,User,BriefContent,Content,id,Tag} = BlogPostById? BlogPostById:{};
		let currentBlogPostById = this.props.BlogPostById;
		let nextLoading = nextProps.loadingBlogPostById;
		let currentLoading = this.props.loadingBlogPostById;
		if(currentLoading && !nextLoading && BlogPostById ) {
			this.updateStore(BlogPostById);
			pushTag(Tag.map((tag)=>({key:tag.id,label:tag.Name})));
		}else if(currentBlogPostById !== BlogPostById && BlogPostById) {
			this.updateStore(BlogPostById);
			pushTag(Tag.map((tag)=>({key:tag.id,label:tag.Name})));
		}
}

saveBlogPost(closeAfter=true) {
 let {selectedBlogPost,updateBlogPost,showSnackbar} = this.props;
 let {id,Title,State,Image,AuthorId,BriefContent,Content} = selectedBlogPost ? selectedBlogPost : {};
 updateBlogPost(id,{Title,State,Image,AuthorId,BriefContent,Content})
		.then(()=>{
			this.setState({busy:false,busyMessage:'',errorText:''});
			showSnackbar('Update changes successfully.');
		 });
}

editContent(content) {
	let {selectedBlogPost} = this.props;
	let {id,Content} = selectedBlogPost ? selectedBlogPost : {};
	window.location=`/BlogPost?BlogPostId=${id}&Content=${content}`;

}

previewContent(content) {
	let {selectedBlogPost} = this.props;
	let {id,Content} = selectedBlogPost ? selectedBlogPost : {};
	window.location=`/preview?BlogPostId=${id}&Content=${content}`;

}

render(){
		let {generalInfo:{busy,busyMessage,errorText},isOverviewEditorOpen} = this.state;
		let {selectedBlogPost,BlogPostId} = this.props;
		//let {errors,url,uploading} = selectedBlogPost ? selectedBlogPost : {};
		let {Title,State,Image,User,AuthorId,BriefContent,Content,id,errors,url,uploading} = selectedBlogPost ? selectedBlogPost : {};
		let {FullName} = User ? User : {};

		return (
				<div className="fullheight layout">
					<AppBar title={Title} onDestroy={()=>{}} onUndoDestroy={()=>{}}/>
					<div className="scrollable fullheight" >
					 <div style={{padding:"5px 0"}}>
						<Card style={{maxWidth:'1024px', margin:'0 auto'}}>
							<CardHeader title="BlogPost Information"/>
							<CardText>
								<div className="row" style={{backgroundColor:'#fff',textAlign:'center'}}>
									<div style={{padding:'20px 0',flexGrow:1}}>
									   <TextField hintText="Title" ref="Title" floatingLabelText="Title" name="Title" id="Title" value={Title} errorText={errors.Title} onChange={(e)=>{this.props.editBlogPost({Title:e.target.value});}}/>
								     <br/>
										 <TextField hintText="AuthorName" disabled={true} ref="AuthorName" floatingLabelText="AuthorName" name="AuthorName" id="AuthorName" value={FullName}/>
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
										Attach Content in Editor
										<IconButton onClick={this.editContent.bind(this)}>
												<EditorAttachFile/>
										</IconButton>
										{Content ? (
											<FlatButton label="Preview" primary={true} onClick={this.previewContent.bind(this)}/>
										) : null }
									</div>
									<div style={{flexGrow:1}}>
										<TextField style={{width:'300px',textAlign:'left'}} id="BriefContent" multiLine={true} rows={5} floatingLabelText="BriefContent" errorText={errors.BriefContent} value={BriefContent} onChange={(e)=>{this.props.editBlogPost({BriefContent:e.target.value});}}/>
										<br/>
										<ImageUploadEditor/>
									</div>
								</div>
							</CardText>
							<CardActions>
								<FlatButton label="Save" onClick={(this.saveBlogPost.bind(this))} primary={true}/>
							</CardActions>
						</Card>
					 </div>
					 <div style={{padding:"5px 0"}}>
							{/**<BlogPostTagMapper ProductGroup={ProductGroup} ProductId = {ProductId} defaultGroupId={DefaultGroupId} style={{maxWidth:'1024px', margin:'0 auto'}}/>**/}
              <BlogPostTagMapper blogPostId={BlogPostId} style={{maxWidth:'1024px', margin:'0 auto'}}/>
					 </div>
				  </div>
				</div>
			);
	}
}

const TheComponent =   compose(
	blogPostByIdQuery,
	updateBlogPostMutation,
	connect(
		state=>({selectedBlogPost:state.BlogPost.selectedBlogPost,ArrOfTag:state.BlogPost.MapOfTag}),
		dispatch=>({
			editBlogPost:(edit)=>{
				dispatch({type:'BLOGPOST_SELECTED_SET',edit});
			},
			defaultPhotoEdit:(DefaultPhoto)=>{
				dispatch({type:'BLOGPOST_DEFAULT_PHOTO_EDIT',DefaultPhoto});
		 },
		 pushTag:(edit)=>{
	 			dispatch({type:'ADD_TAG_OF_BLOGPOST',edit})
	 		},
	  showSnackbar:(message)=>{
			 dispatch({type:'ADMIN_SITE_SNACKBAR_OPEN',message});
		 }
		})
	),
)(BlogPostPage);

	export default ({params:{id}})=>{
		return (<TheComponent BlogPostId={id} BlogPost={{id}}/>);
	};
