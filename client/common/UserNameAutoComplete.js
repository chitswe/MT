import React from 'react';
import AutoComplete from './AutoComplete';
import {graphql,compose} from 'react-apollo';
import {connect} from 'react-redux';

const dataSourceConfig = {
            text: 'FullName',
            value: 'id'
          };

class UserNameAutoComplete extends React.Component{

  constructor(){
  	super(...arguments);
  			this.state={
  				searchSpecValueText:'',
  				searchUserText:'',
  				selectedUser:null,
  				selectedSpecValue:null,
  				loading:false
  			};
  }

	queryDataForAutoComplete(searchText){
		let {onSearchTextChange} = this.props;
		if(onSearchTextChange)
			onSearchTextChange(searchText);
	}

  render(){
		let {onNewRequest,hintText,floatingLabelText,openOnFocus,loading,fullWidth,anchorOrigin,targetOrigin,popoverProps,menuStyle,UserList} = this.props;
    let {searchUserText} = this.state;
    targetOrigin = targetOrigin? targetOrigin:{vertical:'top',horizontal:'left'};
		anchorOrigin=anchorOrigin?anchorOrigin:{vertical:'bottom',horizontal:'left'};
		popoverProps = popoverProps?popoverProps:{};
		popoverProps = {style:{height:'300px',width:'300px'},...popoverProps};
    return (
			<AutoComplete
	            hintText={hintText}
	            floatingLabelText={floatingLabelText}
	            searchText={searchUserText}
	            onUpdateInput={this.queryDataForAutoComplete.bind(this)}
	            onNewRequest={onNewRequest}
	            dataSource={UserList}
	            dataSourceConfig={dataSourceConfig}
	            filter={AutoComplete.noFilter}
	            openOnFocus={openOnFocus}
	            loading={loading}
	            targetOrigin={targetOrigin}
	            anchorOrigin={anchorOrigin}
	            popoverProps={popoverProps}
	            menuStyle={{width:'100%'}}
	            fullWidth={fullWidth}
            />
			);
	}
}

export default compose(
  connect(
  )
)(UserNameAutoComplete);
