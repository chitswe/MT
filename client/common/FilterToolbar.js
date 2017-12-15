import React from 'react';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import {Card} from 'material-ui/Card';
import IconButton from 'material-ui/IconButton';
import ContentFilterList from 'material-ui/svg-icons/content/filter-list';
import {black} from 'material-ui/styles/colors';

class FilterToolBar extends React.Component{
  handleViewModeChange(mode){
    const {onViewModeChange} = this.props;
    if(onViewModeChange)
      onViewModeChange(mode);
  }
  handleFilterButtonPress(){
    const {onFilterButtonPress} = this.props;
    if(onFilterButtonPress)
      onFilterButtonPress();
  }
  render(){
    const {viewMode,sortMode,onFilterDrawerToggle} = this.props;

    const styles = {
      card:{
        padding:'0 16px',
        margin:0,
        flex:1,
        alignItems:'center',
        display:'flex',
        justifyContent:'center'
      },
      picker:{
        width:200,
        alignSelf:'flex-start'
      }
    };

    return (    

      <div style={this.props.style} className={this.props.className}>
        <Card  containerStyle={styles.card}>
          <SelectField
              id="sortModeDropDown"
              value={sortMode} 
              style={styles.picker}
              onChange={(e,index,value)=>{
              this.props.onSortChange(value);}}>
                  <MenuItem value={1} primaryText="Best Match" />
                  <MenuItem value={2} primaryText="Price(Low to High)" />
                  <MenuItem value={3} primaryText="Price(High to Low)" />
          </SelectField> 
          <div style={{flex:1}}></div>
          <IconButton  touch={true} onClick={()=>{onFilterDrawerToggle();}}>
              <ContentFilterList color={black} />
          </IconButton>
        </Card>
      </div>
    );
  }
}


export default FilterToolBar;
