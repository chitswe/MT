import React from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import {compose} from 'react-apollo';
import {connect} from 'react-redux';
import LoadingIndicator from '../../../common/LoadingIndicator';
import {createTagMutation} from '../../apollo/Tag';
import {initialData} from '../../reducer/Tag';
import TextField from 'material-ui/TextField';
class TagCreateDialog extends React.Component {

  constructor() {
    super(...arguments);
    this.state={
      busy:false,
      busyMessage:'',
      errorText:''
    };
  }

  saveTag(closeAfter=true) {
    let {selectedTag,createTag,onRequestClose,showSnackbar} = this.props;
    let {isValid,uploading,id,Name,SrNo}  = selectedTag ? selectedTag :{};
    if(uploading) {
      showSnackbar("Tag is still uploading!.Please wait");
      return;
    }
   if(isValid) {
      this.setState({busy:true,busyMessage:'Create new Tag',errorText:''});
      createTag({
        variables:{
          tags:{
           Name
          }
        }
      })
      .then(()=>{
        this.setState({busy:false,busyMessage:'',errorText:''});
        this.props.editTag(initialData.selectedTag);
        showSnackbar('New Tag created!');
      }).catch(error=>{
        console.log(error);
        this.setState({busy:false,busyMessage:'',errorText:error});
      });
    }
  }

  render() {
    let {selectedTag,isOpen,onRequestClose,editTag} = this.props;
    let {Name,errors}  = selectedTag ? selectedTag : {};
    let {busy,busyMessage,errorText}= this.state;
    let dialogActions = [
      <FlatButton label="Cancel" primary={true} onTouchTap={onRequestClose}/>,
      <FlatButton label="OK" primary={true} onTouchTap={this.saveTag.bind(this)}/>
    ];

    return (
      <Dialog open={isOpen} actions={dialogActions} modal={true} title="Create new Tag" onTouchTap={onRequestClose}>
      <TextField hintText="Name" ref="Name" floatingLabelText="Name" errorText={errors.Name} value={Name} onChange={(e)=>{this.props.editTag({Name:e.target.value});}}/>
       <LoadingIndicator loading={busy} loadingMessage={busyMessage} errorText={errorText}/>
      </Dialog>
    );
  }
}
export default
compose(
   connect(
     state=>({selectedTag:state.Tag.selectedTag}),
     dispatch=>({
       editTag:(edit)=>{
         dispatch({type:'TAGS_SELECTED_SET',edit});
       },
       showSnackbar:(message)=>{
                 dispatch({
                     type:'ADMIN_SITE_SNACKBAR_OPEN',
                     message
                 });
             }
     })
   ),
   createTagMutation
)(TagCreateDialog);
