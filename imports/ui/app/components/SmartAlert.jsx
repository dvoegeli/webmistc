import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import classNames from 'classnames';
import AppState from '/imports/api/appState.js';
 
// SmartAlert component - interactive user notification system
class SmartAlert extends Component {
  render() {
    const chip = classNames(
      'chip w3-opacity w3-teal w3-small w3-slim', {
      'chip--fullscreen': this.props.whiteboard_fullscreen,
    });
    return (
      <div className={chip} style={{top: '30px'}}>
        <span className="chip__icon w3-deep-orange">
          <i className="fa-bullhorn fa fa-fw"/>
        </span>
        Student 1
      </div>
    );
  }
}
 
SmartAlert.propTypes = {
  whiteboard_fullscreen: PropTypes.bool.isRequired,
};
 
export default createContainer(() => {
  return {
    whiteboard_fullscreen: AppState.get('whiteboard_fullscreen'),
  };
}, SmartAlert);