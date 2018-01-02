import React from 'react';
import {compose,graphql} from 'react-apollo';
import gql from 'graphql-tag';
import Loader from '../../../common/Loader';
import Waypoint from 'react-waypoint';
import AppBar from './AppBar';
//import {imageQuery,deleteImageMutation,saveSortOrderDownMutation,saveSortOrderUpMutation,saveSortOrderMutation} from '../../apollo/Tag';
import {tagsQuery,saveSortOrderMutation,saveSortOrderDownMutation,saveSortOrderUpMutation} from '../../apollo/Tag';
import TagCard from './TagCard';
import FlatButton from 'material-ui/FlatButton';
import TagCreateDialog from './TagCreateDialog';
import DetailViewer from './DetailViewer';
import {initialData} from '../../reducer/Tag';
import ConfirmDialog from '../../../common/ConfirmDialog';
import {connect} from 'react-redux';
class TagBrowser extends React.Component {
  constructor() {
      super(...arguments);
      this.state={
        isEditMode:false,
        isConfirmDeleteOpen:false
      };
  }

  componentDidMount(){
    let {Tag} = this.props;
    this.setSortOrder(Tag);
  }
  componentWillReceiveProps(nextProps){
    let {Tag} = nextProps;
    if(Tag !== this.props.Tag){
          this.setSortOrder(Tag);
    }
  }
  setSortOrder(Tag){
    let {setSortOrder} = this.props;
    let {list} = Tag? Tag:{};
    list = list?list:[]
    const sortOrder = list.map(({id,SrNo,Name})=>({id,SrNo,Name}));
    setSortOrder(sortOrder);
  }

  newTag() {
    let {editTag,selectedTag} = this.props;
    this.props.editTag(initialData.selectedTag);
    this.setState({isEditMode:true})
  }

  deleteTag(){
    // let {deleteImage,selectedTag} = this.props;
    // let {id,Image} = selectedTag ? selectedTag : {};
    // deleteImage(id,Image)
    //   .then(()=>{
    //     this.props.editImage(initialData.selectedTag);
    //     this.setState({isConfirmDeleteOpen:false});
    //   });
  }

  sortOrderUp(){
    // let {saveSortOrderUp,selectedTag} = this.props;
    let {tagsList,saveSortOrder,selectedTag} = this.props;
    let {SrNo} = selectedTag ? selectedTag : {};

    const sort = [];
    for(let s of tagsList){
      let {id,OldSrNo} = s;
      if(OldSrNo <= SrNo){
        sort.push({id,SrNo:OldSrNo-1});
      }
    }
    saveSortOrder(sort);

  }

  sortOrderDown(){
    //let {saveSortOrderDown,selectedTag} = this.props;
    let {tagsList,saveSortOrder,selectedTag} = this.props;
    let {SrNo} = selectedTag ? selectedTag : {};


    const sort = [];
    for(let s of tagsList){
      let {id,OldSrNo} = s;
      if(OldSrNo >= SrNo){
        sort.push({id,SrNo:OldSrNo+1});
      }
    }
    saveSortOrder(sort);
  }

  sortOrderSave(){
    let {tagsList,saveSortOrder} = this.props;

    const sort = [];
    for(let s of tagsList){
      let {SrNo,OldSrNo,id} = s;
      if(SrNo !== OldSrNo){
        sort.push({id,SrNo});
      }
    }
    saveSortOrder(sort);
  }

  render() {
    let {loading,Tag,loadMoreTag,tagsList} = this.props;
    let {pagination,list} = Tag ? Tag : {};
    let {page,pageSize,hasMore} = pagination? pagination:{};

    return (
      <div className="layout fullheight">
      {this.state.isEditMode ?
        <TagCreateDialog isEditMode={true} isOpen={this.state.isEditMode} onRequestClose={()=>{
            this.setState({isEditMode:false});
            }
       }  title="Create Tag" /> : false}
      <AppBar title="Tag" onCreateNew={this.newTag.bind(this)} onDelete={()=>{this.setState({isConfirmDeleteOpen:true});}}
          onSortOrderUp={this.sortOrderUp.bind(this)} onSortOrderDown={this.sortOrderDown.bind(this)} onSortOrderSave={this.sortOrderSave.bind(this)}/>
      <div className="fullheight row"
           style={{
             flexWrap:"nowrap"
           }}
      >
      <div className="scrollable fullheight" style={{minWidth:"350px", backgroundColor:'#e3e3e3'}}>
          {loading?<Loader/>:null}
          {list?list.map((item,index) => (<TagCard key={item.id} TagItem={item} index={index}/>)) : null}
          <Waypoint onEnter={()=>{

            if(!loading && hasMore)
              loadMoreTag(page+1)
              }
            }
          bottomOffset="0px"
          />
      </div>
       <DetailViewer/>
      </div>
      <ConfirmDialog title="Confirm Delete" message="Are you sure to delete this Image?" open={this.state.isConfirmDeleteOpen} onConfirmed={this.deleteTag.bind(this)} onCancelled={()=>{this.setState({isConfirmDeleteOpen:false});}}/>
      </div>

    )
  }
}

export default compose(
  connect(
    state=>({selectedTag:state.Tag.selectedTag,tagsList:state.Tag.sortOrder}),
    dispatch=>({
      editTag:(edit)=>{
        dispatch({type:'TAGS_SELECTED_SET',edit});
      },
      setSortOrder:(sortOrder)=>{
            dispatch({type:'TAGS_SORT_ORDER_SET',sortOrder});
      }
    })
  ),
  tagsQuery,
  saveSortOrderDownMutation,
  saveSortOrderUpMutation,
  saveSortOrderMutation,
)(TagBrowser);
