import React from 'react';
import BlogPostState from '../../common/BlogPostState';

const BlogPostStateColor = (StateId)=>{
	let style={
			color:'#fff',
		};
	switch(StateId){
		 case BlogPostState.DRAFT.id:
		 		style.backgroundColor='#777';
				style.border='1px solid #777';
				break;
			case BlogPostState.PUBLISHED.id:
				style.backgroundColor='#337ab7';
				style.border='1px solid #337ab7';
				break;
			case BlogPostState.ARCHIVED.id:
				style.backgroundColor='#5cb85c';
				style.border='1px solid #5cb85c';
				break;
			default:
				style.backgroundColor='#fff';
				style.color='#000';
				style.border='1px solid #000';
				break;
		}
		return style;
};
class BlogPostStateLabel extends React.Component{
	render(){
		let {BlogPostState} = this.props;
		let {id,Name} = BlogPostState?BlogPostState:{};
		let colorStyle = BlogPostStateColor(id);
		let style={
			fontSize:'12px',
			padding:'8px',
			flexShrink:0,
			...colorStyle
		};
		return (
			<span
				style={style}
			>
				{Name}
			</span>
			);
	}
}

export default BlogPostStateLabel;
export {BlogPostStateColor};
