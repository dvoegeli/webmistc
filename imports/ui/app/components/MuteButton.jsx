import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import classNames from 'classnames';
import AppState from '/imports/api/appState.js';
import AudioConference from '/imports/api/audioConference.js';

// MuteButton component - mutes the microphone
class MuteButton extends Component {
  constructor(props) {
    super(props);
  }
  toggleMute(){
    AppState.set('mic_muted', !this.props.mic_muted);
    this.props.mic_muted ? AudioConference.unmute() : AudioConference.mute();
    
  }

  render() {
    const button = classNames(
      'mute-btn w3-btn w3-btn-floating-large ripple w3-card-2', {
      'w3-light-green w3-text-white': !this.props.mic_muted,
      'w3-pink w3-text-white': this.props.mic_muted,
      'mute-btn--fullscreen': this.props.whiteboard_fullscreen,
    });

    const icon = classNames(
      'fa fa-fw', {
      'fa-microphone': !this.props.mic_muted,
      'fa-microphone-slash': this.props.mic_muted,
    });
    return (
      <button className={button} onClick={() => this.toggleMute()}>
        <i className={icon}/>
      </button>
    );
  }
}

MuteButton.propTypes = {
  whiteboard_fullscreen: PropTypes.bool.isRequired,
  mic_muted: PropTypes.bool.isRequired,
  sound_volume: PropTypes.number.isRequired,
};
 
export default createContainer(() => {
  return {
    whiteboard_fullscreen: AppState.get('whiteboard_fullscreen'),
    mic_muted: AppState.get('mic_muted'),
    sound_volume: AppState.get('sound_volume'),
  };
}, MuteButton);