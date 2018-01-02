import React from 'react';
import BlogPostState from '../../common/BlogPostState';
import {BlogPostStateColor} from './BlogPostStateLabel';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import update from 'react-addons-update';

class BlogPostStateSelectField extends React.Component{

 render(){
		let {floatingLabelText,hintText,dropDownMenuProps,value,...p} = this.props;
		floatingLabelText = floatingLabelText? floatingLabelText: "State";
		hintText = hintText? hintText:'State';
		dropDownMenuProps = dropDownMenuProps? dropDownMenuProps:{
						targetOrigin:{vertical:'top',horizontal:'left'},
		        		anchorOrigin:{vertical:'bottom',horizontal:'left'}
					};
		return (
			<SelectField
				{...p}
				value={value}
				floatingLabelText={floatingLabelText}
				hintText={hintText}
				dropDownMenuProps={dropDownMenuProps}
				>
				<MenuItem insetChildren={true} value={null} primaryText="" />
				<MenuItem insetChildren={true} style={{verticalAlign:'middle'}}
        			value={BlogPostState.DRAFT.id} primaryText={BlogPostState.DRAFT.Name} key={BlogPostState.DRAFT.id}/>
				<MenuItem insetChildren={true}
        			value={BlogPostState.PUBLISHED.id} primaryText={BlogPostState.PUBLISHED.Name} key={BlogPostState.PUBLISHED.id}/>
				<MenuItem insetChildren={true}
        			value={BlogPostState.ARCHIVED.id} primaryText={BlogPostState.ARCHIVED.Name} key={BlogPostState.ARCHIVED.id}/>
      	</SelectField>
			);
	}
}
export default BlogPostStateSelectField;
