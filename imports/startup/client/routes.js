import React from 'react';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';

// app component
import App from '../../ui/app/layouts/app.jsx';
// page components for site
import Home from '../../ui/site/pages/home/home.jsx';
import Setup from '../../ui/site/pages/setup/setup.jsx';
import NotFound from '../../ui/site/pages/not-found/not-found.jsx';

export const renderRoutes = () => (
  <Router history={browserHistory}>
    <Route path="/" component={Home} />
    <Route path='app' component={App} />
    <Route path='setup' component={Setup} />
    <Route path='*' component={NotFound} />
  </Router>
);
  {/*<Router history={browserHistory}>
    <Route path='/' component={Home}>
      <Route path='app' component={App} />
      <Route path='setup' component={Setup} />
      <Route path='*' component={NotFound} />
    </Route>
  </Router>*/}