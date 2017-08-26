import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check, Match } from 'meteor/check';

import AppState from './appState';
import { Slides } from './slides';

export const Recordings = new Mongo.Collection('recordings');

let isRecording = false;

// TODO: need to enter a NOP recording at the beginning to set start time
// otherwise, the slides will not sync up with the audio

Meteor.methods({
  'recordings.reset' () {
    Recordings.remove({});
  },
  'recordings.insert' (action, params) {
    if (!isRecording) return;
    check(action, String);
    check(params, Array);
    const interaction = {
      action,
      params,
      time: Date.now()
    }
    Recordings.insert(interaction);
  },
  'recordings.fetch' () {
    return Recordings.find({}, {
      fields: { _id: false },
      sort: { date: 1 }
    }).fetch();
  },
  'recordings.start' () {
    if (!isRecording) return;
    // a NOP recording entry at the beginning to set start time
    // otherwise, the slides will not sync up with the audio
    const interaction = {
      action: 'recordings.start',
      params: [],
      time: Date.now()
    }
    Recordings.insert(interaction);
  },
  'recordings.record' (state) {
    isRecording = state;
    if (!isRecording) return;
    Meteor.call('recordings.reset');
    Meteor.call('recordings.start');
  }
});