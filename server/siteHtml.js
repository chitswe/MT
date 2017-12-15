/**
 * Created by ChitSwe on 2/25/17.
 */
/**
 * Created by ChitSwe on 12/22/16.
 */
import React, { PropTypes } from 'react';
import muiThemeable from 'material-ui/styles/muiThemeable';
const scriptUrl = "/site.bundle.js";
const siteHtml = ({ content, state,muiTheme,helmet }) => (
    <html lang="en">
    <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />   
        <meta name="theme-color" content={muiTheme.palette.primary1Color}/>     
        <link rel="stylesheet" href="/style/flexboxgrid.min.css"  />
        <link rel="stylesheet" href="/style/sitestyle.css"/>
        <link rel="stylesheet" type="text/css" href="/style/csgrid.css"/>
        <link rel="apple-touch-icon" sizes="180x180" href="/favicon/apple-touch-icon.png"/>
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon/favicon-32x32.png"/>
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon/favicon-16x16.png"/>
        <link rel="manifest" href="/favicon/manifest.json"/>
        <link rel="mask-icon" href="/favicon/safari-pinned-tab.svg" color="#f44336"/>
        <link rel="shortcut icon" href="/favicon/favicon.ico"/>
        <meta name="apple-mobile-web-app-title" content="mt.com.mm"/>
        <meta name="application-name" content="mt.com.mm"/>
        <meta name="msapplication-config" content="/favicon/browserconfig.xml"/>
        {helmet.title.toComponent()}
        {helmet.meta.toComponent()}
        {helmet.link.toComponent()}
        
    </head>
    <body>
    <div id="content" dangerouslySetInnerHTML={{ __html: content }} />

    <script
        dangerouslySetInnerHTML={{ __html: `window.__APOLLO_STATE__=${JSON.stringify(state)};` }}
        charSet="UTF-8"
    />
    <script src={scriptUrl} charSet="UTF-8" />
    </body>
    </html>
);

siteHtml.propTypes = {
    content: PropTypes.string.isRequired,
    state: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
};

export default siteHtml;
