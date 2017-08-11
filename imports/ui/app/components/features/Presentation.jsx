import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import classNames from 'classnames';

import AppState from '/imports/api/appState.js';
import api from '/imports/api/presentation.js';
 
// Presentation component - menu for presentation features
class Presentation extends Component {
  closeMenu(){
    AppState.set('features_show', 'none');
  }
  toggleRecord(){
    const isRecording = !this.props.record_start;
    AppState.set('record_start', isRecording);
    Meteor.call('recordings.record', isRecording);
    if(isRecording){
      Meteor.call('recordings.reset');
    }
  }

  togglePlayback(){
    AppState.set('playback_start', !this.props.playback_start);
  }

  render() {
    const presentationControl = classNames(
      'panel w3-card-4 w3-animate-right', {
      'w3-hide': !_.isEqual(this.props.features_show, 'presentation'),
    });
    const record = {
      recordingButton: classNames(
        'w3-btn w3-text-white w3-margin-right', {
        'w3-cyan': !this.props.record_start,
        'w3-light-blue': this.props.record_start,
      }),
      recordingButtonIcon: classNames(
        'fa-circle fa fa-fw fa-lg', {
        'w3-text-white': !this.props.record_start,
        'w3-text-red': this.props.record_start,
      }),
      pauseResumeButton: classNames(
        'w3-btn w3-text-white w3-cyan w3-text-white', {
        'w3-disabled': !this.props.record_start,
      }),
      pauseResumeButtonIcon: classNames(
        'fa fa-fw fa-lg', {
        'fa-pause': !this.props.record_start,
        'fa-play': this.props.record_start,
      }),
    }
    const playback = {
      playPauseButton: 'w3-btn w3-text-white w3-cyan w3-text-white w3-margin-right',
      playPauseButtonIcon: classNames(
        'fa fa-fw fa-lg', {
        'fa-play': !this.props.playback_start,
        'fa-pause': this.props.playback_start,
      }),
    }
    return (
      <div className={presentationControl}>
        <header className="panel__header w3-container w3-teal">
                  <a className="w3-teal w3-left-align" onClick={()=>this.closeMenu()}>
            <i className="fa-chevron-left fa fa-lg fa-fw w3-margin-right"/>
            Presentation
          </a>
        </header>
        <main className="panel__content w3-container">
          <ul className="w3-ul w3-text-teal">
            <li>
              <h4>Playback</h4>
              <a className="flex-row">
                <label>
                  <input type="file" style={{display: "none"}}/>
                  <i className="fa-folder-open-o fa fa-lg fa-fw w3-margin-right"/>Open Presentation
                </label>
              </a>
              <div className="w3-section flex-row flex-row--center">
                <button className='w3-btn w3-text-white w3-cyan w3-margin-right'>
                  <i className='fa-backward fa fa-lg'/>
                </button>
                <button className={playback.playPauseButton} onClick={()=>this.togglePlayback()}>
                  <i className={playback.playPauseButtonIcon}/>
                </button>
                <button className='w3-btn w3-text-white w3-cyan'>
                  <i className='fa-forward fa fa-lg'/>
                </button>
              </div>
              <div className="w3-margin-bottom">
                <input style={{width: 100 + '%'}} type="range" value="50" readOnly/>
                <p className="w3-center w3-text-cyan" style={{width: 100 + '%'}}>00:02:10/00:05:20</p>
              </div>
            </li>
            <li>
              <h4>Record</h4>
              <a className="flex-row w3-text-teal" onClick={()=>api.save()}>
                <i className="fa-save fa fa-lg w3-margin-right"/>
                Save Presentation
              </a>
              <div className="w3-section flex-row flex-row--center" style={{width: 100 + '%'}}>
                <button className={record.recordingButton} onClick={()=>this.toggleRecord()}>
                  <i className={record.recordingButtonIcon}/>
                </button>
                <button className={record.pauseResumeButton} onClick={()=>this.toggleRecord()}>
                  <i className={record.pauseResumeButtonIcon}/>
                </button>
              </div>
              <p className="w3-center w3-text-teal" style={{width: 100 + '%'}}>00:02:35</p>
            </li>
          </ul>
        </main>
      </div>
    );
  }
}
 
 
Presentation.propTypes = {
  features_show: PropTypes.string.isRequired,
  record_start: PropTypes.bool.isRequired,
  playback_start: PropTypes.bool.isRequired,

};
 
export default createContainer(() => {
  return {
    features_show: AppState.get('features_show'),
    record_start: AppState.get('record_start'),
    playback_start: AppState.get('playback_start'),
  };
}, Presentation);