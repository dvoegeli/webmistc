import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import classNames from 'classnames';
import _ from 'lodash';

import InputRange from 'react-input-range';

import AppState from '/imports/api/appState.js';
import SoundFeature from '/imports/api/soundFeature.js';
import AudioConference from '/imports/api/audioConference.js';
import MicVisualizer from '/imports/api/micVisualizer.js';

// Sound component - menu for sound features
class Sound extends Component {
  closeMenu() {
    AppState.set('features_show', 'none');
  }
  changeVolume(value) {
    AppState.set('sound_volume', value);
    AudioConference.volume(value);
  }
  testSpeaker() {
    SoundFeature.speakerTest();
  }
  componentDidMount(){
    MicVisualizer.canvas(this.micVisualizer);
  }
  componentDidUpdate(prevProps){
    const panelShowing = _.isEqual(this.props.features_show, 'sound');
    if(panelShowing){
      MicVisualizer.start();
    } else {
      MicVisualizer.stop();
    }
  }
  render() {
    const sound = classNames(
      'panel w3-card-4 w3-animate-right', {
        'w3-hide': !_.isEqual(this.props.features_show, 'sound'),
      });
    const settings = {
      testButton: 'flex-row w3-padding-0 w3-section w3-text-teal',
      testButtonIcon: 'fa fa-headphones fa-lg w3-margin-right'
    }
    const testSpeakersTooltip = 'Clicking this button should make a beep. <br> ' + 
                                'If not, check your volume or speaker settings.';
    const testMicTooltip = 'This sound bar should move when you talk. <br> ' + 
                           'If not, check your microphone volume or settings.';
    const { sound_audio_context } = this.props;
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
              <h4>Volume</h4> 
              <div className="flex-row flex-row--ends w3-margin-bottom">
                <i className="fa-volume-up fa fa-lg fa-fw w3-margin-right"/>
                <InputRange
                  value={this.props.sound_volume*10}
                  disabled={this.props.mic_muted}
                  minValue={0}
                  maxValue={10}
                  onChange={value => this.changeVolume(value/10)} 
                />
              </div>
            </li>
            <li>
              <h4>Test</h4> 
              <a className={settings.testButton} onClick={()=>this.testSpeaker()} href="#"
                data-tip={testSpeakersTooltip}
                data-place="left" 
                data-delayShow={100}
                data-multiline={true}
              >
                <i className={settings.testButtonIcon}/>
                Test speakers
              </a>
              <div className="flex-row flex-row--ends w3-margin-bottom"
                data-tip={testMicTooltip}
                data-place="left" 
                data-delayShow={100}
                data-multiline={true}
              >
                <i className="fa-microphone fa fa-lg fa-fw w3-margin-right"/>
                <div className="w3-progress-container w3-tiny">
                  <canvas id="test" style={{width: '100%', height: '100%'}}
                  ref={(ref) => this.micVisualizer = ref}
                  />
                </div>
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
  sound_volume: PropTypes.number.isRequired,
  sound_audio_context: PropTypes.bool.isRequired,
  mic_muted: PropTypes.bool.isRequired
};

export default createContainer(() => {
  return {
    features_show: AppState.get('features_show'),
    sound_volume: AppState.get('sound_volume'),
    sound_audio_context: AppState.get('sound_audio_context'),
    mic_muted: AppState.get('mic_muted')
  };
}, Sound);
