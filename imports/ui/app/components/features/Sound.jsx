import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import classNames from 'classnames';

import AppState from '/imports/api/appState.js';
import '/imports/api/sound.js';

// TODO: Change from Sound to Conferencing
// Sound component - menu for sound features
class Sound extends Component {
  closeMenu() {
    AppState.set('features_show', 'none');
  }
  toggleSoundTest() {
    AppState.set('sound_test', !this.props.sound_test)
  }
  render() {
    const sound = classNames(
      'panel w3-card-4 w3-animate-right', {
        'w3-hide': !_.isEqual(this.props.features_show, 'sound'),
      });
    const settings = {
      muteButton: classNames(
        'w3-btn w3-text-white', {
          'w3-light-green': !this.props.mic_muted,
          'w3-pink': this.props.mic_muted,
        }),
      muteButtonIcon: classNames(
        'fa fa-lg w3-margin-right', {
          'fa-microphone': !this.props.mic_muted,
          'fa-microphone-slash': this.props.mic_muted,
        }),
      testButton: 'flex-row w3-padding-0 w3-section w3-text-teal',
      testButtonIcon: classNames(
        'fa fa-lg w3-margin-right', {
          'fa-cogs': !this.props.sound_test,
          'fa-cog fa-spin': this.props.sound_test,
        }),
    }
    return (
      <div className={sound}>
        <header className="panel__header w3-container w3-teal">
          <a className="w3-teal w3-left-align" onClick={()=>this.closeMenu()}>
            <i className="fa-chevron-left fa fa-lg fa-fw w3-margin-right"/>
            Sound Settings
          </a>
        </header>
        <main className="panel__content w3-container">
          
          <ul className="w3-ul w3-text-teal">
            <li>
              <h4>Input Level</h4> 
              <p className="w3-text-green">RECEIVING</p>
              <div className="w3-progress-container w3-tiny w3-margin-bottom">
                <div className="w3-progressbar w3-orange" style={{width:85 + '%'}}></div>
                <div className="w3-progressbar w3-green" style={{width:75 + '%'}}></div>
              </div>
            </li>
            <li>
              <h4>Sound Test</h4> 
              <a className={settings.testButton} onClick={()=>this.toggleSoundTest()} href="#">
                <i className={settings.testButtonIcon}/>
                {!this.props.sound_test ? 'Start Test' : 'Testing...'}
              </a>
            </li>
            <li>
              <h4>Speaker Volume</h4> 
              <div className="flex-row flex-row--ends w3-margin-bottom">
                <i className="fa-volume-up fa fa-lg fa-fw w3-margin-right"/>
                <input style={{width: 100 + '%'}} type="range" value="50" readOnly/>
              </div>
            </li>
            <li>
              <h4>Microphone Volume</h4> 
              <div className="flex-row flex-row--ends w3-margin-bottom">
                <i className="fa-microphone fa fa-lg fa-fw w3-margin-right"/>
                <input style={{width: 100 + '%'}} type="range" value="100" readOnly/>
              </div>
            </li>
          </ul>

        </main>
      </div>
    );
  }
}


Sound.propTypes = {
  features_show: PropTypes.string.isRequired,
  sound_test: PropTypes.bool.isRequired,
  mic_muted: PropTypes.bool.isRequired
};

export default createContainer(() => {
  return {
    features_show: AppState.get('features_show'),
    sound_test: AppState.get('sound_test'),
    mic_muted: AppState.get('mic_muted')
  };
}, Sound);
