import React from 'react';
import NumberEditor from '../../../common/editor/NumberEditor';
import {Card,CardHeader,CardMedia,CardActions} from 'material-ui/Card';
import {connect} from 'react-redux';

class TagCard extends React.Component {
  render() {
    let {TagItem,selectedId,selectTag,index} = this.props;
    let {id,SrNo,Name,url} = TagItem? TagItem : {};
    return (<div style={{padding:"4px"}} onClick={()=>{selectTag(id);}}>
      <Card style={{backgroundColor:id===selectedId? "#e3e3e3":"#FFF"}} containerStyle={{display:'flex',alignItems:'center',justifyContent:'center',backgroundColor:id===selectedId ? "#e3e3e3":"#fff"}}>
      <CardHeader title={Name}  subtitle={Name}/>
        <span style={{flex:1}}></span>
        <div style={{flexGrow:0,flexShrink:0,margin:'10px'}}><NumberEditor style={{maxWidth:'100px'}} inputStyle={{maxWidth:'100px',padding:'5px'}} numberPrecision={0} onChange={value=>{this.props.editSortOrder(index,value);}} hintText="Sort order" floatingLabelText="Sort Order" id={`SrNo${id}`} value={SrNo} /></div>
      </Card>
    </div>)
  }
}


export default connect(
  state=>({selectedId:state.Tag.selectedId}),
  dispatch=>({
    selectTag:(id) => {
      dispatch({type:'TAGS_SELECT',id});
    },
    editSortOrder:(index,SrNo)=>{
        dispatch({type:'TAGS_SORT_ORDER_EDIT',SrNo,index});
    }
  })
)(TagCard);//state=>pro
