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
import ContentSort from 'material-ui/svg-icons/content/sort';
import ContentUndo from 'material-ui/svg-icons/content/undo';

const AppBar=({muiTheme,title,toggleDrawer,router,onCreateNew,onDelete,onUndoDestroy,onSortOrderSave,onSortOrderUp,onSortOrderDown})=>{
	let toolBar = <Toolbar style={{height:'64px',backgroundColor:muiTheme.palette.primary1Color}}>
        <ToolbarGroup firstChild={true}>
      	<IconButton touch={true} onTouchTap={toggleDrawer}>
					<NavigationMenu color={white} />
						</IconButton>
			            <ToolbarTitle style={{color:'#fff'}} text={title}/>
				</ToolbarGroup>
				<ToolbarGroup lastChild={true}>
				   <IconButton touch={true} onClick={()=>{router.push(`/admin/BlogPostSortOrder`);}}>
					    <ContentSort color={white}/>
					 </IconButton>
					 <IconButton touch={true} onClick={onCreateNew} tooltip="Create BlogPost">
			                <ContentAdd color={white}/>
			            </IconButton>
						<IconButton touch={true} onClick={onDelete} tooltip="Delete BlogPost">
						 <ActionDelete color={white}/>
						</IconButton>
						<IconButton touch={true} onTouchTap={onUndoDestroy} tooltip="Undo delete">
							<ContentUndo color={white} />
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

// <IconButton touch={true} onTouchTap={()=>{router.goBack();}}>
// 		<NavigationArrowBack color={white} />
// </IconButton>
