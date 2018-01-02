import React from 'react';
import {compose,graphql} from 'react-apollo';
import gql from 'graphql-tag';
import Loader from '../../../common/Loader';
import Waypoint from 'react-waypoint';
import AppBar from './AppBar';
import {connect} from 'react-redux';
import {blogPostQuery,deleteBlogPostMutation,undoDeleteBlogPostMutation} from '../../apollo/BlogPost';
import BlogPostCard from './BlogPostCard';
import BlogPostGrid from  './BlogPostGrid';
import DetailViewer from './DetailViewer';
import {initialData} from '../../reducer/BlogPost';
import BlogPostCreateDialog from './BlogPostCreateDialog';
class BlogPostBrowser extends React.Component {
  constructor() {
      super(...arguments);
      this.state={
        isEditMode:false,
        isConfirmDeleteOpen:false
      };
  }

  newBlogPost() {
    let {editTag,selectedBlogPost} = this.props;
    this.props.editBlogPost(initialData.selectedBlogPost);
    this.setState({isEditMode:true})
  }

  deleteBlogPost(){
    let {showSnackBar,selectedBlogPost,deleteBlogPost} = this.props;
    let {selected} = selectedBlogPost ? selectedBlogPost : {};

    if(selected.length > 0) {
      this.setState({busy:true,busyMessage:'Deleting BlogPost',errorText:''});
      this.props.deleteBlogPost(selected)
         .then(()=>{
           this.setState({busy:false,busyMessage:'',errorText:''});
           showSnackBar('Deleted is successful.');
         })
         .catch((error)=>this.setState({busy:false,busyMessage:'Error',errorText:error}));
    }
  }

  undoDeleteBlogPost() {
    let {showSnackBar,selectedBlogPost,undoDeleteBlogPost} = this.props;
    let {selected} = selectedBlogPost ? selectedBlogPost: {};

    if(selected.length > 0) {
      this.setState({busy:true,busyMessage:'Undo Deleting',errorText:''});
      this.props.undoDeleteBlogPost(selected)
      .then(()=>{
        this.setState({busy:false,busyMessage:'',errorText:''});
        showSnackBar ('UndoDelete is successful.');
      })
      .catch((error)=>this.setState({busy:false,busyMessage:'Error',errorText:error}));
    }

  }


  sortOrderUp(){

  }

  sortOrderDown(){

  }

   sortOrderSave(){

   }
  render() {
    let {loading,BlogPost,loadMoreBlogPost} = this.props;
    let {pagination,list} = BlogPost ? BlogPost : {};
    let {page,pageSize,hasMore} = pagination? pagination:{};

    return (
      <div className="layout fullheight">
      {this.state.isEditMode ?
        <BlogPostCreateDialog onImageUploadComplete={()=>{}} isEditMode={true} isOpen={this.state.isEditMode} onRequestClose={()=>{
            this.setState({isEditMode:false});
            }
       }  title="Create BlogPost" /> : false}

      <AppBar title="BlogPost" onCreateNew={this.newBlogPost.bind(this)} onDelete={this.deleteBlogPost.bind(this)} onUndoDestroy={this.undoDeleteBlogPost.bind(this)}
          onSortOrderUp={this.sortOrderUp.bind(this)} onSortOrderDown={this.sortOrderDown.bind(this)} onSortOrderSave={this.sortOrderSave.bind(this)}/>
      <div className="fullheight row"
           style={{
             flexWrap:"nowrap"
           }}
      >
      <BlogPostGrid/>
      </div>
      </div>
    )
  }
}

export default compose(
  connect(
    state=>({selectedBlogPost:state.BlogPost.selectedBlogPost,blogPostList:state.BlogPost.sortOrder}),
    dispatch=>({
      editBlogPost:(edit)=>{
        dispatch({type:'BLOGPOST_SELECTED_SET',edit});
      },
      setSortOrder:(sortOrder)=>{
            dispatch({type:'BLOGPOST_SORT_ORDER_SET',sortOrder});
      }
    })
  ),
  blogPostQuery,
  deleteBlogPostMutation,
  undoDeleteBlogPostMutation
)(BlogPostBrowser)


//
// <div className="scrollable fullheight" style={{minWidth:"350px", backgroundColor:'#e3e3e3'}}>
//     {loading?<Loader/>:null}
//     {list?list.map((item,index) => (<BlogPostCard key={item.id} PostItem={item} index={index}/>)) : null}
//     <Waypoint onEnter={()=>{
//
//       if(!loading && hasMore)
//         loadMoreTag(page+1)
//         }
//       }
//     bottomOffset="0px"
//     />
// </div>
