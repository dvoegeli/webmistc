import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import classNames from 'classnames';
 
import AppState from '/imports/api/appState.js';
 

// BadgeAlert component - small badge to broadcast app state
class BadgeAlert extends Component {

  render() {
    const badge = classNames(
      'chip w3-opacity w3-teal w3-small w3-slim', {
      'chip--fullscreen': this.state.whiteboard.fullscreen,
    });
    return (

    );
  }
}
 
 
FeaturesMenuButton.propTypes = {

};
 
export default createContainer(() => {
  return {

  };
}, BadgeAlert);