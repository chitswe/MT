import NavigationMenu from 'material-ui/svg-icons/navigation/menu';
import {Toolbar,ToolbarGroup,ToolbarTitle} from 'material-ui/Toolbar';
import NavigationArrowBack from 'material-ui/svg-icons/navigation/arrow-back';
import {white} from 'material-ui/styles/colors';
import Paper from 'material-ui/Paper';
import muiThemeable from 'material-ui/styles/muiThemeable';
import IconButton from 'material-ui/IconButton';
import React from 'react';
import {compose} from 'react-apollo';
import {connect} from 'react-redux';
import {withRouter} from 'react-router';
import ContentSave from 'material-ui/svg-icons/file/cloud-done';
import ContentUp from 'material-ui/svg-icons/file/file-upload';
import ContentDown from 'material-ui/svg-icons/file/file-download';
import ContentAdd from 'material-ui/svg-icons/content/add';
import ActionDelete from 'material-ui/svg-icons/action/delete';

const AppBar=({muiTheme,title,toggleDrawer,onCreateNew,onDelete,onSortOrderSave,onSortOrderUp,onSortOrderDown,router})=>{
	let toolBar = <Toolbar style={{height:'64px',backgroundColor:muiTheme.palette.primary1Color}}>
			        <ToolbarGroup firstChild={true}>
			        	<IconButton touch={true} onTouchTap={toggleDrawer}>
			                <NavigationMenu color={white} />
			            </IconButton>
			            <IconButton touch={true} onTouchTap={()=>{router.goBack();}}>
			                <NavigationArrowBack color={white} />
			            </IconButton>
			            <ToolbarTitle style={{color:'#fff'}} text={title}/>
					</ToolbarGroup>
					<ToolbarGroup lastChild={true}>
						<IconButton touch={true} onClick={onCreateNew} tooltip="New Tag">
			                <ContentAdd color={white}/>
			            </IconButton>
						<IconButton touch={true} onClick={onDelete} tooltip="Delete Tag">
						 <ActionDelete color={white}/>
						</IconButton>
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

export default compose(
		connect(
			state=>({}),
			dispatch=>({
				toggleDrawer:()=>{
					dispatch({type:'ADMIN_SITE_NAV_DRAWER_TOGGLE'});
				}
			})
		),
		muiThemeable(),
		withRouter
	)(AppBar);
