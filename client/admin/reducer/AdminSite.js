import update from 'react-addons-update';
const initialData={
	isSnackbarOpen:false,
	snackbarMessage:'',
	isNavDrawerOpen:false,
	isChatPopoverOpen:false,
	chatPopoverTarget:null,
	senderId:null
}

const AdminSite=(state=initialData,action)=>{
	switch(action.type){
		 case 'ADMIN_SITE_SNACKBAR_OPEN':
		 	return update(state,{
		 		isSnackbarOpen:{$set:true},
		 		snackbarMessage:{$set:action.message}
		 	});
		 	break;
		 case 'ADMIN_SITE_SNACKBAR_CLOSE':
		 	return update(state,{
	 			isSnackbarOpen:{$set:false},
	 			snackbarMessage:{$set:''}
		 	});
		 	break;
		 case 'ADMIN_SITE_DRAWER_OPEN':
		 	return update(state,{
		 		isNavDrawerOpen:{
		 			$set:true
		 		}
		 	});
		 	break;
		 case 'ADMIN_SITE_NAV_DRAWER_CLOSE':
		 	return update(state,{
		 		isNavDrawerOpen:{
		 			$set:false
		 		}
		 	});
		 	break;
	 	case 'ADMIN_SITE_NAV_DRAWER_TOGGLE':
		 	return update(state,{
		 		isNavDrawerOpen:{$set:!state.isNavDrawerOpen}
		 	});
		 	break;
		case 'ADMIN_SITE_CHAT_POPOVER_OPEN':
		 	return update(state,{
		 		isChatPopoverOpen:{$set:true}
		 	});
		 	break;
		 case 'ADMIN_SITE_CHAT_POPOVER_CLOSE':
		 	return update(state,{
		 		isChatPopoverOpen:{$set:false}
		 	});
		 	break;
		 case 'ADMIN_SITE_CHAT_POPOVER_TARGET':
		 	return update(state,{
		 		chatPopoverTarget:{
		 			$set:action.edit
		 		}
		 	});
		 	break;
		case 'ADMIN_SITE_CHAT_SENDER':
		 	return update(state,{
		 		senderId:{
		 			$set:action.edit
		 		}
		 	});
		 	break; 	
		 default:
		 	return state;
		 	break;
	}
};
export {initialData};
export default AdminSite;