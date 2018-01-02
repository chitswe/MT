import React from 'react';
import {Route,IndexRoute} from 'react-router';
import Layout from './layout';
import Home from './components/home';
import UserBrowser from './components/UserManagement/UserBrowser';
import TagBrowser from './components/Tag/index';
import BlogPostBrowser from './components/BlogPost/index';
import BlogPostPage from './components/BlogPostPage/index';
import BlogPostSortOrderGrid from './components/BlogPost/BlogPostSortOrderGrid';
export default (
    <Route component={Layout} path="/admin">
        <IndexRoute component={Home}/>
       <Route component={UserBrowser} path="/admin/UserManagement"/>
       <Route component={TagBrowser} path="/admin/Tag"/>
       <Route component={BlogPostBrowser} path="/admin/BlogPost"/>
       <Route component={BlogPostPage} path="/admin/BlogPostDetail(/:id)" />
       <Route component={BlogPostSortOrderGrid} path="/admin/BlogPostSortOrder"/>
    </Route>
);
