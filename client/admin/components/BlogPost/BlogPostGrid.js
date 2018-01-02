import React from 'react';
import Accounting from 'accounting';
import {Card,CardText,CardActions} from 'material-ui/Card';
import Badge from 'material-ui/Badge';
import CsGrid,{populateOrderBy} from '../../../common/CsGrid/index';
import RaisedButton from 'material-ui/RaisedButton';
import {red500} from 'material-ui/styles/colors';
import {blue500} from 'material-ui/styles/colors';
import {green500} from 'material-ui/styles/colors';
import {blogPostQuery} from '../../apollo/BlogPost';
import CircularProgress from 'material-ui/CircularProgress';
const InfiniteScroll = require('../../../common/InfiniteScroller')(React);
import {withRouter} from 'react-router';
import {compose} from 'react-apollo';
import {connect} from 'react-redux';
import BlogPostTimeHistoryLabel from '../../../common/BlogPostTimeHistoryLabel';
import {formatDateTime} from '../../../../common/DateTimeParser';
import BlogPostStateLabel from '../../../common/BlogPostStateLabel';
import {toBlogPostState} from '../../../../common/BlogPostState';
import NumberEditor from '../../../common/editor/NumberEditor';

class BlogPostGrid extends React.Component{
  constructor(){
         super(...arguments);
         this.state={
             busy:false,
             busyMessage:'',
             isEditMode:false,
             errorText:'',
             selected:[],
             selectedIndex:null,
             selectedItem:null,
             primaryKey:'id',
             changeToCardAt:'xs',
             cardLabelWidth:'150px',
             columns:[
               {
                     caption:'Title',
                     key:'Title',
                     width:'150px',
                     canGrow:false,
                     hideAt:'xs'
                 },
                 {
                     caption:'State',
                     key:'State',
                     width:'90px',
                     canGrow:false,
                     hideAt:'lg',
                     format:(value)=>((value !== null || value !== undefined || value !== NaN) ? <BlogPostStateLabel BlogPostState={toBlogPostState(value)}/> :null)
                },
                 {
                     caption:'AuthorName',
                     key:'User',
                     width:'150px',
                     canGrow:false,
                     hideAt:'xs',
                     format:(value)=>(value? value.FullName:'')
                 },
                 {
                     caption:'BriefContent',
                     key:'BriefContent',
                     textAlign:'right',
                     captionAlign:'center',
                     width:'120px',
                     canGrow:false,
                     hideAt:'xs'
                 },
                 {
                     caption:'Content',
                     key:'Content',
                     width:'200px',
                     canGrow:false,
                     textAlign:'right',
                     captionAlign:'center',
                     hideAt:'xs'
                },
                 {
                   caption:'CreatedHistory',
                   key:'updatedAt',
                   width:'200px',
                   canGrow:false,
                   textAlign:'right',
                   captionAlign:'center',
                   hideAt:'xs',
                   format:(value)=>(value?<BlogPostTimeHistoryLabel dateTimeHistory={formatDateTime(value,value)}/> :null)

                 }
              ]
         };

     }

    handleRowsSelectionChanged(selected){
        this.setState({selected});
        this.props.selectedItem(selected);
    }

    render(){

    let {BlogPost,selectedBlogPost,loading,editBlogPost,loadMoreBlogPost,router} = this.props;
    let {pagination,list} = BlogPost ? BlogPost :[];
    let {page,pageSize,hasMore,totalRows,totalPages} = pagination? pagination: {};
    let {primaryKey,changeToCardAt,cardLabelWidth,columns,selected,selectedIndex,selectedItem} = this.state;
    return (
                    <div className="fullheight layout">
                        <CsGrid
                        primaryKey={primaryKey}
                        changeToCardAt={changeToCardAt}
                        cardLabelWidth={cardLabelWidth}
                        columns={columns}
                        hasMore={hasMore}
                        page={page}
                        pageSize={pageSize}
                        data={list}
                        onRowDoubleClick={item=>{
                            this.props.selectBlogPostId(item.id);
                            router.push(`/admin/BlogPostDetail/${item.id}`);
                        }}
                        selected={selected}
                        rowsSelectionChanged={this.handleRowsSelectionChanged.bind(this)}
                        />
                    </div>

            );
    }
}

export default compose(
  connect(
  state=>({selectedBlogPost:state.BlogPost.selectedBlogPost,selectedId:state.BlogPost.selectedId}),
  dispatch=>({
    selectedItem:((selected)=>{
       dispatch({type:'BLOGPOST_SELECTED_ITEM',selected})
    }),
    editBlogPost:(edit)=>{
      dispatch({type:'BLOGPOST_SELECTED_SET',edit});
    },
    selectBlogPostId:(id) => {
      dispatch({type:'BLOGPOST_SELECT_ID',id});
    }
  })
),
withRouter,
blogPostQuery,
//saveProductOrderMutation
)(BlogPostGrid);
