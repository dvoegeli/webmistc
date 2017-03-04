import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import classNames from 'classnames';
 
import { AppState } from '../../../api/appState.js';
 

// MuteButton component - mutes the microphone
class MuteButton extends Component {
  constructor(props) {
    super(props);
  }
  toggleMute(){
    AppState.toggle('mic_muted');
  }

  render() {
    const button = classNames(
      'mute-btn w3-btn w3-btn-floating-large ripple w3-card-2', {
      'w3-light-green w3-text-white': !this.props.muted,
      'w3-pink w3-text-white': this.props.muted,
      'mute-btn--fullscreen': this.props.whiteboard_fullscreen,
    });

    const icon = classNames(
      'fa fa-fw', {
      'fa-microphone': !this.props.muted,
      'fa-microphone-slash': this.props.muted,
    });
    return (
      <button className={button} onClick={this.toggleMute}>
        <i className={icon}/>
      </button>
    );
  }
}
 
 
MuteButton.propTypes = {
  whiteboard_fullscreen: PropTypes.bool.isRequired,
  muted: PropTypes.bool.isRequired,
};
 
export default createContainer(() => {
  return {
    whiteboard_fullscreen: AppState.get('whiteboard_fullscreen'),
    muted: AppState.get('mic_muted'),
  };
}, MuteButton);