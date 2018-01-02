import React from 'react';
import NumberEditor from '../../../common/editor/NumberEditor';
import {Card,CardActions} from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import {connect} from 'react-redux';
import {compose} from 'react-apollo';
import {formatDateTime} from '../../../../common/DateTimeParser';
import BlogPostTimeHistoryLabel from '../../../common/BlogPostTimeHistoryLabel';
class BlogPostSortOrderItem extends React.Component{


	render(){
		let {BlogPost,index,selected,selectedIndex,editSortOrder,selectBlogPostSortOrder,selectBlogPostSortIndex} = this.props;
    let {id,SrNo,Title,State,AuthorId,Image,BriefContent,Content,createdAt,updatedAt} = BlogPost ? BlogPost : {};
		//
		// if(SrNo == null) {
		// 	editSortOrder(index,index+1);
		// }
    return (
			<div onClick={()=>{selectBlogPostSortOrder(SrNo);selectBlogPostSortIndex(index);}} className="row" style={{padding:'0px 8px',flexWrap:'nowrap',alignItems:'center',borderBottom:'1px solid rgba(0,0,0,.3)',backgroundColor:index===selectedIndex? '#F5F5F5' : '#fff'}}>
				<div style={{width:'10%'}}>{index + 1}</div>
				<div style={{width:'80%'}}>{Title}</div>
				<div style={{width:'80%'}}><BlogPostTimeHistoryLabel dateTimeHistory={formatDateTime(createdAt,updatedAt)}/></div>
				<div style={{flexGrow:0,flexShrink:0,margin:'10px'}}>
				    <NumberEditor style={{maxWidth:'100px'}} inputStyle={{maxWidth:'100px',padding:'5px'}} numberPrecision={0} onChange={value=>{this.props.editSortOrder(index,value);}} hintText="Sort order" floatingLabelText="Sort Order" id={`SrNo${id}`} value={SrNo}/>
				</div>

			</div>
			);
	}
}
export default compose(
	connect(
		state=>({selectedIndex:state.BlogPost.sortOrderActiveIndex}),
		dispatch=>({
			editSortOrder:(index,SortOrder)=>{
					dispatch({type:'BLOGPOST_SORT_ORDER_EDIT',SortOrder,index});
			},
			selectBlogPostSortIndex:(index)=>{
				dispatch({type:'BLOGPOST_SORT_ORDER_INDEX_SELECT',index});
			},
			selectBlogPostSortOrder:(SortOrder)=>{
				dispatch({type:'BLOGPOST_SORT_ORDER_SELECT',SortOrder});
			}
		})
	)
)(BlogPostSortOrderItem)
