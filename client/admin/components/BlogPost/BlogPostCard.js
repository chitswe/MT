import React from 'react';
import NumberEditor from '../../../common/editor/NumberEditor';
import {Card,CardHeader,CardMedia,CardActions} from 'material-ui/Card';
import {connect} from 'react-redux';
import {formatDateTime} from '../../../../common/DateTimeParser';

class BlogPostCard extends React.Component {
  render() {
    let {PostItem,selectedId,selectBlogPost,index} = this.props;
    let SrNo;
    let {id,Title,createdAt,updatedAt} = PostItem? PostItem : {};
    return (
      <div style={{padding:"4px"}} onClick={()=>{selectBlogPost(id);}}>
      <Card style={{backgroundColor:id===selectedId? "#e3e3e3":"#FFF"}} containerStyle={{display:'flex',alignItems:'center',justifyContent:'center',backgroundColor:id===selectedId ? "#e3e3e3":"#fff"}}>
      <CardHeader title={Title} subtitle={formatDateTime(createdAt,updatedAt)}/>
        <span style={{flex:1}}></span>
        <div style={{flexGrow:0,flexShrink:0,margin:'10px'}}><NumberEditor style={{maxWidth:'100px'}} inputStyle={{maxWidth:'100px',padding:'5px'}} numberPrecision={0} onChange={value=>{this.props.editSortOrder(index,value);}} hintText="Sort order" floatingLabelText="Sort Order" id={`SrNo${id}`} value={SrNo} /></div>
      </Card>
    </div>)
  }
}


export default connect(
  state=>({selectedId:state.BlogPost.selectedId}),
  dispatch=>({
    selectBlogPost:(id) => {
      dispatch({type:'BLOGPOST_SELECT_ID',id});
    }
  })
)(BlogPostCard);//state=>pro
