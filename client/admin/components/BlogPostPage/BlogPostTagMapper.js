import React from 'react';
import {List,ListItem} from 'material-ui/List';
import ContentClear from 'material-ui/svg-icons/content/clear';
import IconButton from 'material-ui/IconButton';
import {compose} from 'react-apollo';
import {connect} from 'react-redux';
import {mapBlogPostToTagMutation,unMapBlogPostToTagMutation} from '../../apollo/BlogPost';
import {tagByBlogPostQuery} from '../../apollo/Tag';
import AutoComplete from '../../../common/AutoComplete';
import RaisedButton from 'material-ui/RaisedButton';
import Checkbox from 'material-ui/Checkbox';
import {Card,CardText,CardHeader,CardActions} from 'material-ui/Card';
import Avatar from 'material-ui/Avatar';
import Chip from 'material-ui/Chip';

class BlogPostTagMapper extends React.Component{

constructor(){
	super(...arguments);
			this.state={
				searchSpecValueText:'',
				searchTagText:'',
				selectedTag:null,
				selectedSpecValue:null,
				loading:false
			};
}

handleAdd(){
	let {mapBlogPostToTag,pushTag,blogPostId} = this.props;
	//let {selectedSpecValue,selectedSpec,searchSpecText,searchSpecValueText} = this.state;
	let {selectedTag,searchTagText} = this.state;
	let TagId = selectedTag ? selectedTag.id : null;
	let TagName = searchTagText;
	let BlogPostId = blogPostId;
	this.setState({loading:true});
	//mapBlogPostToTag({variables:{BlogPostId,TagId,TagName}})
	mapBlogPostToTag(BlogPostId,TagId,TagName).then((result)=>{
		let {data} = result;
		    let {Tag} = data? data.mapBlogPostToTag: [];
				  if(Tag){
							 pushTag(Tag.map((tag)=>({key:tag.id,label:tag.Name})));
					 }
					 this.setState({loading:false,searchTagText:'',selectedTag:null});
	}).catch(e=>{
		this.setState({loading:false});
	});
}

handleRequestDelete(key,label) {
	let {ArrOfTag,unMapBlogPostToTag,pushTag,blogPostId} = this.props;
	let {selectedTag,searchTagText} = this.state;

  this.setState({loading:true});
	unMapBlogPostToTag(blogPostId,key).then((result)=>{
		let {data} = result;
		  let {Tag} = data? data.unMapBlogPostToTag: [];
			if(Tag) {
				pushTag(Tag.map((tag)=>({key:tag.id,label:tag.Name})));
		 }
		 this.setState({loading:false,searchTagText:'',selectedTag:null});
	}).catch(e=>{
		this.setState({loading:false});
	});
}

handleRequestNew(item) {
	if(typeof item === 'string') {
		this.setState({searchTagText:item});
	}else{
		this.setState({selectedTag:item,searchTagText:item.Name});
	}

}

render(){
	let {style,ArrOfTag,TagByBlogPost,loading} = this.props;
	let {searchTagText,selectedTag} = this.state;
	//let {PossibleTag} = selectedTag ? selectedTag : [];
	const tagDataSourceConfig = {
					text: 'Name',
					value: 'id'
			};
	return (
		<Card style = {style}>
			<CardHeader title="Tag Mapping"/>
			<CardText>
			<div className="row">
			{
				ArrOfTag? ArrOfTag.map((element,index)=>(
					<Chip key={element.key}	onRequestDelete={() => this.handleRequestDelete(element.key,element.label)} style={{margin:4,display:'flex',flexWrap:'wrap'}}>
					   {element.label}
					</Chip>
				)):null

			}
			</div>
		   	<AutoComplete
				 textFieldStyle={{width:'100%'}}
				 hintText="Search Tag"
				 searchText={searchTagText}
				 onNewRequest={this.handleRequestNew.bind(this)}
				 dataSource={TagByBlogPost ? TagByBlogPost : []}
				 dataSourceConfig={tagDataSourceConfig}
				 filter={AutoComplete.caseInsensitiveFilter}
				 openOnFocus={false}
				 loading={loading}
				 id="searchTag"
				 name="searchTag"
				 targetOrigin={{vertical:'top',horizontal:'left'}}
				 anchorOrigin={{vertical:'bottom',horizontal:'left'}}
				 fullWidth={true}
				 popoverProps={{style:{height:'300px'}}}
				/>
				<RaisedButton primary={true} label="Add Mapping" style={{display:'block'}} onClick={this.handleAdd.bind(this)}/>
			</CardText>
		</Card>

		);
}
}

export default compose(
connect(
	state =>({ArrOfTag:state.BlogPost.MapOfTag}),
	dispatch=>({
		pushTag:(edit)=>{
			dispatch({type:'ADD_TAG_OF_BLOGPOST',edit})
		},
	})
),
mapBlogPostToTagMutation,
unMapBlogPostToTagMutation,
tagByBlogPostQuery
)(BlogPostTagMapper);
