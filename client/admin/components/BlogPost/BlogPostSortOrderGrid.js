import React from 'react';
import {Toolbar,ToolbarGroup,ToolbarTitle} from 'material-ui/Toolbar';
import NavigationMenu from 'material-ui/svg-icons/navigation/menu';
import NavigationArrowBack from 'material-ui/svg-icons/navigation/arrow-back';
import BlogPostSortOrderItem from './BlogPostSortOrderItem';
import {connect} from 'react-redux';
import {Card,CardHeader,CardText,CardActions} from 'material-ui/Card';
import { List, ListItem } from 'material-ui/List';
import {white} from 'material-ui/styles/colors';
import ContentSave from 'material-ui/svg-icons/file/cloud-done';
import ContentUp from 'material-ui/svg-icons/file/file-upload';
import ContentDown from 'material-ui/svg-icons/file/file-download';
import CircularProgress from 'material-ui/CircularProgress';
import Checkbox from 'material-ui/Checkbox';
import Avatar from 'material-ui/Avatar';
const InfiniteScroll = require('../../../common/InfiniteScroller')(React);
import RaisedButton from 'material-ui/RaisedButton';
import IconButton from 'material-ui/IconButton';
import muiThemeable from 'material-ui/styles/muiThemeable';
import {blogPostQuery,saveSortOrderMutation,saveSortOrderUpMutation,saveSortOrderDownMutation} from '../../apollo/BlogPost';
import {compose} from 'react-apollo';
import {withRouter} from 'react-router';
import Paper from 'material-ui/Paper';


const AppBar=({muiTheme,router,title,toggleDrawer,onSortOrderUp,onSortOrderDown,onSortOrderSave})=>{
	let toolBar = <Toolbar style={{height:'64px',backgroundColor:muiTheme.palette.primary1Color}}>
			        <ToolbarGroup firstChild={true}>
			        	<IconButton touch={true} onTouchTap={toggleDrawer} >
			                <NavigationMenu color={white} />
			            </IconButton>
			            <IconButton touch={true} onTouchTap={()=>{router.goBack();}}>
			                <NavigationArrowBack color={white} />
			            </IconButton>
			            <ToolbarTitle style={{color:'#fff'}} text={title}/>
			        </ToolbarGroup>
			        <ToolbarGroup lastChild={true}>
			        	<IconButton touch={true} onTouchTap={onSortOrderSave} tooltip="Save Sorting" >
			                <ContentSave color={white} />
			            </IconButton>
		            	<IconButton touch={true} onTouchTap={onSortOrderUp} tooltip="Sort Order Up" >
			                <ContentUp color={white} />
			            </IconButton>
			            <IconButton touch={true} onTouchTap={onSortOrderDown} tooltip="Sort Order Down">
			                <ContentDown color={white} />
			            </IconButton>
			        </ToolbarGroup>
			    </Toolbar>;

			    return (
			        <Paper zDepth={3} style={{zIndex:1}}>
			            {toolBar}
			        </Paper>
			    );
			};

const ThemeableAppBar =compose(
    connect(
        dispatch=>({
            toggleDrawer:()=>{
                dispatch({type:'ADMIN_SITE_NAV_DRAWER_TOGGLE'});
            }
        })
    ),
    withRouter,
    muiThemeable()
)(AppBar);

class BlogPostSortOrderGrid extends React.Component{
	constructor(){
		super(...arguments);
		this.state={
			productId:null,
			loading:false,
			loadingMessage:'',
			errorText:''
		}
	}

  componentWillReceiveProps(nextProps) {
	let {BlogPost,blogPostList} = nextProps;
	 if(blogPostList.length > this.props.blogPostList.length)	{
		 this.setSortOrder(BlogPost);
	 }
	}

	componentDidMount() {
	let {BlogPost} = this.props;
	this.setSortOrder(BlogPost);
	}

	setSortOrder(BlogPost){
		let {setSortOrder} = this.props;
		let {list} = BlogPost?BlogPost:{};
		list = list?list:[]
		const sortOrder = list.map(({id,Title,SrNo,State,AuthorId,Image,BriefContent,Content,createdAt,updatedAt})=>({id,Title,SrNo,State,AuthorId,Image,BriefContent,Content,createdAt,updatedAt}));
		setSortOrder(sortOrder);
	}

  sortOrderSave() {
		let {blogPostList,saveSortOrder} = this.props;

		const sort = [];
		for(let s of blogPostList) {
			let {SrNo,OldSrNo,id,Title,AuthorId,BriefContent} = s
			if(SrNo !== OldSrNo) {
				sort.push({id,SrNo,Title,AuthorId,BriefContent});
			}
		}
		saveSortOrder(sort);
	}

	sortOrderUp(){
		let {blogPostList,saveSortOrderUp,selectedStory} = this.props;
		let {SrNo} = selectedStory ? selectedStory : {};

		const sort = [];
		for(let s of blogPostList){
			let {id,OldSrNo} = s;
			if(OldSrNo <= SrNo){
				sort.push({id,SrNo:OldSrNo-1});
			}
		}
		saveSortOrderUp(sort);
  }

	sortOrderDown() {
	 let {blogPostList,saveSortOrderDown,selectedStory} = this.props;
	 let {SrNo} = selectedStory ? selectedStory : {};

	 const sort = [];
	 for(let s of blogPostList) {
		 let {id,OldSrNo} = s;
		 if(OldSrNo >= SrNo) {
			 sort.push({id,SrNo:OldSrNo+1});
		 }
	 }
	 saveSortOrderDown(sort);
	}

	render(){
		let {blogPostList,loading,loadMore,page,hasMore,parentGroupId,className,style} = this.props;
		return (
		<div className="layout fullheight">
			<Card className="fullheight" containerStyle={{height:'100%',display:'flex',flexDirection:'column'}}>
			<ThemeableAppBar title="Story Order Sorting" onSortOrderUp={this.sortOrderUp.bind(this)} onSortOrderDown={this.sortOrderDown.bind(this)} onSortOrderSave={this.sortOrderSave.bind(this)}/>
				<CardText className="fullheight scrollable">
					{
						blogPostList.map((blogPost,index)=>(<BlogPostSortOrderItem BlogPost={blogPost} index={index} key={blogPost.id}/>))
					}
				</CardText>
			</Card>
		</div>);
	}
}

const  TheComponent= compose(
	connect(
			state=>({blogPostList:state.BlogPost.sortOrder,selectedBlogPost:state.BlogPost.selectedBlogPost}),
      dispatch=>({
			setSortOrder:(sortOrder)=>{
				dispatch({type:'BLOGPOST_SORT_ORDER_SET',sortOrder})
			},
			editSortOrder:(index,SrNo)=>{
					dispatch({type:'BLOGPOST_SORT_ORDER_EDIT',SrNo,index});
			}
		})
	),
	blogPostQuery,
	saveSortOrderMutation,
	saveSortOrderUpMutation,
	saveSortOrderDownMutation
)(BlogPostSortOrderGrid);

	export default ({params:{id},...props})=>{
		return (<TheComponent parentGroupId={id} page={1}/>);
	}
