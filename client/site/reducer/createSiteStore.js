/**
 * Created by ChitSwe on 2/25/17.
 */
import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import Site from './Site';
import UserProfile from './UserProfile';
export default ({client})=>{
    const store = createStore(
        combineReducers({
            csrf:state=>(state?state:''),
            Site,
            UserProfile,
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
