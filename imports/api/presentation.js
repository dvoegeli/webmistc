import { Meteor } from 'meteor/meteor';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import _ from 'lodash';

import { Slides } from './slides.js';
import { AudioConference } from './audioConference.js';

export default Presentation = {};

let presentation;
let areSlidesLoaded = false;

function playback(state) {
  const currentState = presentation[state];
  const isEnd = _.isEqual(state, presentation.length - 1);
  if (isEnd) {
    Meteor.apply(currentState.action, currentState.params);
    return;
  }

  const nextState = presentation[state + 1];
  const timeout = parseInt(nextState.time) - parseInt(currentState.time);
  Meteor.setTimeout(() => {
    playback(state + 1);
  }, timeout);
  Meteor.apply(currentState.action, currentState.params);
}

function playPresentation() {
  const FIRST_STATE = 0
  const currentState = presentation[FIRST_STATE];
  const hasNoStateChanges = _.isEqual(presentation.length, 0);
  const hasOneStateChange = _.isEqual(presentation.length, 1);

  if (hasNoStateChanges) return;

  if (hasOneStateChange) {
    Meteor.apply(currentState.action, currentState.params);
    return;
  }

  playback(FIRST_STATE);
}

function loadSuccess(unzipped) {
  Meteor.call('erase.presentation');
  Meteor.call('slides.reset');
  unzipped.forEach((relativePath, file) => {
    file.async('string').then((content) => {
      content = JSON.parse(content);
      const isSlides = _.isEqual(relativePath, 'slides.json');
      const isStateChanges = _.isEqual(relativePath, 'state.json')
      if (isSlides) {
        Slides.loadCollection(content, () => {
          areSlidesLoaded = true;
          if (presentation) {
            playPresentation();
          }
        });
      }

      if (isStateChanges) {
        presentation = content;
        if (areSlidesLoaded) {
          playPresentation();
        }
      }
    }, (e) => {
      // TODO: place errors in UI, not alert
      alert('error opening file at ' + relativePath)
    });
  });
}

function loadError(error) {
  // TODO: place errors in UI, not alert
  alert(error.message)
}

// Returns a promise
// Use .then(()=>{...}) to use the promise
Presentation.save = () => {
  Meteor.call('recordings.fetch', (error, recordings) => {
    if (error) {}
    const zip = new JSZip();
    zip.file('state.json', JSON.stringify(recordings));
    zip.file('slides.json', JSON.stringify(Slides.collection()));
    // zip.file('audio.opus', AudioConference.audio());
    zip.generateAsync({ type: 'blob' }).then((blob) => {
      saveAs(blob, 'presentation.mstc');
    });
  });
}
Presentation.load = (presentation) => {
  var zip = new JSZip();
  zip.loadAsync(presentation).then(loadSuccess, loadError);
}