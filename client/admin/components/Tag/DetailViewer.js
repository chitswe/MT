import React from 'react';
import {compose,graphql} from 'react-apollo';
import gql from 'graphql-tag';
import {connect} from 'react-redux';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import {tagsByIdQuery,tagsQuery,updateTagMutation} from '../../apollo/Tag';
import {Card,CardTitle,CardMedia,CardActions} from 'material-ui/Card';

class DetailViewer extends React.Component {
  constructor(){
   super(...arguments);
   this.state={
     busy:null,
     busyMessage:'',
     errorText:''
   };
 }

  componentWillReceiveProps({TagById}){

      if(this.props.TagById !== TagById && TagById) {
          let {id,SrNo,Name} = TagById? TagById: {};
          this.props.editTag({id,SrNo,Name});
      }
    }

    handleSave() {
      let {updateTag,selectedTag,showSnackBar} = this.props;
      let {id,Name,SrNo} = selectedTag;
      updateTag(id,{Name})
         .then(()=>{
           this.setState({busy:false,busyMessage:'',errorText:''});
           showSnackBar('Saved changes successfully.');
          });

    }
    handleCreateNew() {
      // let {editEmployee} = this.props;
      // editEmployee({id:null,Name:''});
    }
    render() {
      let {selectedId,loading,selectedTag,editTag} =this.props;
      let {id,SrNo,Name} = selectedTag? selectedTag : {};
      return (<div style={{width:'100%',padding:'16px'}}>
                <div  style={{display:'flex',alignItems:'center',justifyContent:'center'}}>
                <TextField hintText="Name" style={{flex:1}} multiLine={true} rows={12} floatingLabelText="Name" id="Name" name="Name"
                    value={Name} onChange={e=>{editTag({Name:e.target.value})}} fullWidth={true}/>
                </div>

                <br/>
                <FlatButton label="Save" onClick={this.handleSave.bind(this)}/>
              </div>);
    }
}

export default compose(
  connect(
    state=>({selectedId:state.Tag.selectedId,selectedTag:state.Tag.selectedTag}),
    dispatch=>({
      editTag:(edit) => {
        dispatch({type:"TAGS_SELECTED_SET",edit});
      },
      showSnackBar:(message)=>{
        dispatch({type:'ADMIN_SITE_SNACKBAR_OPEN',message});
      }
    })
  ),
  tagsByIdQuery,
  updateTagMutation
)(DetailViewer);
