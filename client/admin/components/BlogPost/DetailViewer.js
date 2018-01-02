import React from 'react';
import {compose,graphql} from 'react-apollo';
import gql from 'graphql-tag';
import {connect} from 'react-redux';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
//import {tagsByIdQuery,tagsQuery,updateTagMutation} from '../../apollo/Tag';
//import {Card,CardTitle,CardMedia,CardActions} from 'material-ui/Card';

class DetailViewer extends React.Component {
  render() {
    return (
      <div>
      </div>
    )
  }
}

export default compose(
  connect(
    // state=>({selectedId:state.Tag.selectedId,selectedTag:state.Tag.selectedTag}),
    // dispatch=>({
    //   editTag:(edit) => {
    //     dispatch({type:"TAGS_SELECTED_SET",edit});
    //   },
    //   showSnackBar:(message)=>{
    //     dispatch({type:'ADMIN_SITE_SNACKBAR_OPEN',message});
    //   }
    // })
  ),
  // tagsByIdQuery,
  // updateTagMutation
)(DetailViewer);
