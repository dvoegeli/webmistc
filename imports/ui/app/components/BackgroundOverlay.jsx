import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import classNames from 'classnames';
 
import { AppState } from '../../../api/appState.js';
 

// BackgroundOverlay component - background overlay for menus and navigation
class BackgroundOverlay extends Component {
  toggleFullscreen(){
    AppState.toggle('whiteboard_fullscreen');
  }

  render() {
    const button = classNames(
      'fullscreen-btn w3-btn w3-btn-floating-large ripple w3-card-2 w3-text-white w3-teal', {
      'fullscreen-btn--fullscreen': this.props.whiteboard_fullscreen,
    });
    const icon = classNames(
      'fa fa-fw', {
      'fa-expand': !this.props.whiteboard_fullscreen,
      'fa-compress': this.props.whiteboard_fullscreen,
    });
    return (
      <button className={button} onClick={this.toggleFullscreen}>
        <i className={icon}/>
      </button>
    );
  }
}
 
 
BackgroundOverlay.propTypes = {
  whiteboard_fullscreen: PropTypes.bool.isRequired,
};
 
export default createContainer(() => {
  return {
    whiteboard_fullscreen: AppState.get('whiteboard_fullscreen'),
  };
}, BackgroundOverlay);