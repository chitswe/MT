import React from 'react';
import {Route,IndexRoute} from 'react-router';
import Layout from './layout';
import Home from './components/home';
export default (
    <Route component={Layout} path="/admin">
        <IndexRoute component={Home}/>
    </Route>
);
