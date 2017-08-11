import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check, Match } from 'meteor/check';

import AppState from './appState';

export const Recordings = new Mongo.Collection('recordings');

let isRecording = false;

Meteor.methods({
  'recordings.reset' () {
    Recordings.remove({});
  },
  'recordings.insert' (action, params) {
    if (isRecording) {
      check(action, String);
      check(params, Array);
      const interaction = {
        action,
        params,
        time: Date.now()
      }
      Recordings.insert(interaction);
    }
  },
  'recordings.fetch' () {
    return Recordings.find({}, {
      fields: { _id: false },
      sort: { date: 1 }
    }).fetch();
  },
  'recordings.record' (state) {
    isRecording = state;
  }
});