/**
 * Created by ChitSwe on 2/25/17.
 */
import React,{PropTypes} from 'react';
import {Link} from 'react-router';
import SiteSnackbar from './components/SiteSnackbar';
import NavDrawer from './NavDrawer';
import {getUserProfile} from '../auth';
import {compose} from 'react-apollo';
import {connect} from 'react-redux';
class Layout extends React.Component{
    constructor(){
        super(...arguments);
        this.state={
            loading:true
        };
    }
    componentDidMount(){
        let {setUserProfile,loadCartItems} = this.props;
        let {user_id,user_name,account_type,profile_pic,full_name,entity_id} = getUserProfile();
        setUserProfile({
            userId:user_id,
            userName:user_name,
            accountType:account_type,
            profilePic:profile_pic,
            fullName:full_name,
            entityId:entity_id
        });
        loadCartItems();
        this.setState({loading:false});
    }
    render(){
        return (
            <div>
                <div className={`fullheight layout-root ${this.state.loading? 'hide': ''}`}>
                    {this.props.children}
                    <SiteSnackbar/>
                    <NavDrawer/>
                </div>

                <img className={`loader-ripple ${this.state.loading? '': 'hide'}`} src="/img/ripple.gif"/>
            </div>
        );
    }
}

Layout.PropTypes = {
    children:PropTypes.element
};
export default compose(
        connect(
            state=>({}),
            dispatch=>({
                setUserProfile:(edit)=>{
                    dispatch({type:'USER_PROFILE_EDIT',edit});
                },
                loadCartItems:()=>{
                    dispatch({type:'PRODUCT_CART_ITEMS_RELOAD'});
                }
            })
            )
    )(Layout);
