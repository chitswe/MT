    /**
 * Created by ChitSwe on 12/19/16.
 */
import Express,{Router} from 'express';
import bodyParser from 'body-parser';
import './common/dateUtils';
import Accounting from 'accounting';
import Preference from './common/Preference';
import db from './server/models';
import { apolloExpress, graphiqlExpress } from 'apollo-server';
import { makeExecutableSchema } from 'graphql-tools';
import Schema from './server/data/schema';
import Resolver from './server/data/resolver';
import {default as migration} from './server/database/migration';
import React from 'react';
import ReactDOM from 'react-dom/server';
import routes from './client/admin/routes';
import siteRoutes from './client/site/routes';
import createApolloClient from './common/createApolloClient';
import { createNetworkInterface } from 'apollo-client';
import { match, RouterContext } from 'react-router';
import 'isomorphic-fetch';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import { ApolloProvider, renderToStringWithData } from 'react-apollo';
import injectTapEventPlugin from 'react-tap-event-plugin';
import webpack from 'webpack';
import devConfig from './webpack.dev';
import testConfig from './webpack.test';
import prodConfig from './webpack.prod';
import latency from 'express-simulate-latency';
import {default as adminTheme} from './common/adminMuiTheme';
import {default as siteTheme} from './common/siteMuiTheme';
import createAdminStore from './client/admin/reducer/createAdminStore';
import createSiteStore from './client/site/reducer/createSiteStore';
import cookieParser from 'cookie-parser';
import { formatError } from 'apollo-errors';
injectTapEventPlugin();
import {default as AdminHtml} from './server/adminHtml';
import {default as SiteHtml} from './server/siteHtml';
import   './server/security/auth';
import passport from 'passport';
import proxy from 'proxy-middleware';
import url from "url";
import fs from 'fs';
import Mustache from 'mustache';
import secret from './secret';
import csrf from 'csurf';
import path from 'path';
import { execute, subscribe } from 'graphql';
import { createServer } from 'http';

import {Helmet} from "react-helmet";
import { SubscriptionServer } from 'subscriptions-transport-ws';
import {blogPostHandler,previewHandler,saveContentHandler} from './server/blogpost/BlogPost';

const env = process.env.NODE_ENV;

global.appRoot = path.resolve(__dirname);

const csrfProtection = csrf({ cookie: true })

console.log ( `Running with ${env} mode.`);
let webpackConfig= null;
switch(env){
    case "production":
        webpackConfig = prodConfig;
        break;
    case "development":
        webpackConfig = devConfig;
        break;
    case "test":
        webpackConfig = testConfig;
        break;
    default:
        webpackConfig = prodConfig;
        break;
}
Accounting.settings = {
    currency: Preference.format.currency,
    number: Preference.format.number
};
const app = new Express();
const appRouter = new Router();
const port =env === 'test'? 4242: 4242;
const proxyPort = 4240;
const graphqlUrl=`http://localhost:${port}/graphql`;
app.use(bodyParser.json({limit: '5mb'}));
app.use(bodyParser.urlencoded({limit: '5mb'}));
app.use(passport.initialize());
app.use(cookieParser());
app.disable('x-powered-by');
if(env==="development"){
    app.use(latency({ min: 100, max: 500 }));
    app.use('/admin.bundle.js',proxy(url.parse('http://localhost:' + proxyPort + '/public/admin.bundle.js')));
    app.use('/site.bundle.js',proxy(url.parse('http://localhost:' + proxyPort + '/public/site.bundle.js')));
    app.use('/admin.bundle.js.map',proxy(url.parse('http://localhost:' + proxyPort + '/public/admin.bundle.js.map')));
    app.use('/site.bundle.js.map',proxy(url.parse('http://localhost:' + proxyPort + '/public/site.bundle.js.map')));
}else if(env ==="production"){
    app.get('*.js', function (req, res, next) {
      req.url = req.url + '.gz';
      res.set('Content-Encoding', 'gzip');
      next();
    });
}else if(env==="test"){
     app.get('*.js', function (req, res, next) {
      req.url = req.url.replace("bundle.js","bundle.test.js");
      next();
    });
}

const schema = makeExecutableSchema({
            typeDefs: Schema,
            resolvers:Resolver,
            allowUndefinedInResolve: true,
        });


app.post('/graphql', apolloExpress( (req,res) => {
    return {
        schema,
        formatError,
        context: { user:req.user,httpResponse:res }
    }
}),(req,res)=>{

});


app.use('/graphiql', graphiqlExpress({
    endpointURL: '/graphql',
    //subscriptionsEndpoint: `ws://localhost:${port}/subscriptions`
}));



app.use(Express.static('public'));
function renderHtml(req,res,renderProps,isAdminSite){
    const client = createApolloClient({
        ssrMode: true,
        networkInterface: createNetworkInterface({
            uri: graphqlUrl,
            opts: {
                credentials: 'same-origin',
                headers: req.headers,
            },
        }),
    });
    let store = null;
    let muiTheme=null;
    let html = null;
    if(isAdminSite){
        muiTheme = getMuiTheme(Object.assign({userAgent: req.headers['user-agent']},adminTheme));
        store=createAdminStore({client});
    }else{//render web site
        muiTheme = getMuiTheme(Object.assign({userAgent: req.headers['user-agent']},siteTheme));
        store = createSiteStore({client});
    }

    const component = (
        <MuiThemeProvider muiTheme={muiTheme}>
            <ApolloProvider client={client} store={store}>
                <RouterContext {...renderProps} />
            </ApolloProvider>
        </MuiThemeProvider>
    );

    renderToStringWithData(component).then((content) => {
        const {apollo,...state}= client.store.getState();
        state.csrf=req.csrfToken();
        const data = apollo.data;
        res.status(200);
        const helmet = Helmet.renderStatic();
        const html = isAdminSite?
            (<AdminHtml
            content={content}
            state={Object.assign({ apollo: { data } },state)}
            helmet={helmet}
        />):
            (<SiteHtml
                content={content}
                state={Object.assign({ apollo: { data } },state)}
                muiTheme={siteTheme}
                helmet={helmet}
            />);
        res.send(`<!doctype html>\n${ReactDOM.renderToStaticMarkup(html)}`);
        res.end();
    }).catch(e => console.error('RENDERING ERROR:', e)); // eslint-disable-line no-console
}



app.get('/ping',passport.authenticate('bearer-graphql',{session:false}),(req,res)=>{
    const {user} = req;
    let {isAuthenticated} = user? user:{};
    if(isAuthenticated){
        res.status(200).send("OK");
    }else
        res.status(401).send("Not authenticated");
});



app.get('/admin*',csrfProtection,(req, res) => {
    match({ routes, location: req.originalUrl }, (error, redirectLocation, renderProps) => {
        if (redirectLocation) {
            res.redirect(redirectLocation.pathname + redirectLocation.search);
        } else if (error) {
            console.error('ADMIN ROUTER ERROR:', error); // eslint-disable-line no-console
            res.status(500);
        } else if (renderProps) {
            renderHtml(req,res,renderProps,true);
        } else {//admin routes not match
            res.status(404).send('Not found');
        }
    });
});

app.get('/blogPost',blogPostHandler);
app.post('/saveContent',saveContentHandler);
app.get('/preview',previewHandler);

app.get('*',csrfProtection,(req, res) => {
    match({routes:siteRoutes,location:req.originalUrl},(error,redirectLocation,renderProps)=>{
               if(redirectLocation)
                   res.redirect(redirectLocation.pathname + redirectLocation.search);
               else if(error) {
                   console.error('SITE ROUTER ERROR:', error);
                   res.status(500);
               }else if(renderProps){
                   renderHtml(req,res,renderProps,false);//render site
               }else{
                   res.status(404).send('Not found');
               }
            });
});


function bundleWebpack(){
    console.log('Start webpack bundling');
    webpack(webpackConfig, function (err, stats) {
        if (err)
            console.log(err);
        else {
            console.log('Bundling finished.');
                migration.up().then((migrations) => {
                app.listen(port, () => {
                    console.log(`Server is running on port ${port}`);
                });
            });
        }
    });
}


migration.up().then((migrations) => {
    const ws = createServer(app);

    ws.listen(port, () => {
      console.log(`GraphQL Server is now running on http://localhost:${port}`);

      // Set up the WebSocket for handling GraphQL subscriptions
      new SubscriptionServer({
        execute,
        subscribe,
        schema
      }, {
        server: ws,
        path: '/subscriptions',
      });
    });
});
