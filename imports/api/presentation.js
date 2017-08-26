import { Meteor } from 'meteor/meteor';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import _ from 'lodash';

import { Slides } from '/imports/api/slides';
import AudioConference from '/imports/api/audioConference';

export default Presentation = {};

function playbackStateChanges(state, stateChanges) {
  const currentState = stateChanges[state];
  const isEnd = _.isEqual(state + 1, stateChanges.length);
  if (!isEnd) {
    const nextState = stateChanges[state + 1];
    const timeout = parseInt(nextState.time) - parseInt(currentState.time);
    Meteor.setTimeout(() => {
      playbackStateChanges(state + 1, stateChanges);
    }, timeout);
  }
  Meteor.apply(currentState.action, currentState.params);
}

function playbackAudio(audioData) {
  var audioUrl = URL.createObjectURL( audioData );
  var audio = new Audio();
  audio.src = audioUrl;
  audio.play();
}

function playPresentation(stateChanges, audio) {
  const FIRST_STATE = 0
  const currentState = stateChanges[FIRST_STATE];
  const hasNoStateChanges = _.isEqual(stateChanges.length, 0);
  const hasOneStateChange = _.isEqual(stateChanges.length, 1);

  if (hasNoStateChanges) return;

  if (hasOneStateChange) {
    Meteor.apply(currentState.action, currentState.params);
    return;
  }
  playbackAudio(audio)
  playbackStateChanges(FIRST_STATE, stateChanges);
}

function unzipSuccess(unzipped) {
  Meteor.call('erase.presentation');
  Meteor.call('slides.reset');
  const files = [];
  const STATE_CHANGES = 0;
  const AUDIO = 1;
  unzipped.forEach((relativePath, file) => {
    const isStateChanges = _.isEqual(relativePath, 'state.json');
    const isAudio = _.isEqual(relativePath, 'audio.opus');
    if(isStateChanges){
      files[STATE_CHANGES] = file.async('string');
    }
    if(isAudio){
      files[AUDIO] = file.async('blob');
    }
  });
  Promise.all(files).then(files => { 
    const stateChanges = JSON.parse(files[STATE_CHANGES])
    const audio = files[AUDIO];
    playPresentation(stateChanges, audio);
  }).catch(reason => {
    // TODO: UX: place errors in UI, not alert
    alert('Error loading presentation. ' + reason)
  });
}

function unzipError(error) {
  // TODO: UX: place errors in UI, not alert
  alert("Error unzipping presentation." + error.message)
}

Presentation.save = () => {
  Meteor.call('recordings.fetch', (error, recordings) => {
    if (error) {}
    const zip = new JSZip();
    zip.file('state.json', JSON.stringify(recordings));
    zip.file('audio.opus', AudioConference.getRecording());
    zip.generateAsync({ type: 'blob' }).then((blob) => {
      saveAs(blob, 'presentation.mstc');
    });
  });
}
Presentation.load = (presentation) => {
  var zip = new JSZip();
  zip.loadAsync(presentation).then(unzipSuccess, unzipError);
}