// Client entry point, imports all client code
import '/imports/startup/client';
import '/imports/startup/both';


import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import { renderRoutes } from '../imports/startup/client/routes.js';


Meteor.startup(() => {
  render(renderRoutes(), document.getElementById('render-target'));
});
