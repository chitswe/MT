/**
 * Created by ChitSwe on 1/25/17.
 */
import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import AdminSite from './AdminSite';
import User from './User';
import UserAccount from './UserAccount';
import Login from './Login';
import Tag from './Tag';
import BlogPost from './BlogPost';

export default ({client})=>{
    const store = createStore(
        combineReducers({
            csrf:state=>(state?state:''),
            AdminSite,
            User,
            UserAccount,
            Login,
            Tag,
            BlogPost,
            apollo: client.reducer()
        }),
        client.initialState, // initial state
        compose(
            applyMiddleware(client.middleware()),
            // If you are using the devToolsExtension, you can add it here also
            typeof window !=='undefined' && window.devToolsExtension ? window.devToolsExtension() : f => f
        )
    );
    return store;
};
