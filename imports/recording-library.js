import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { Session } from 'meteor/session';

export const Recordings = new Mongo.Collection('recordings');

export var start;

export var isRecording;

if (Meteor.isServer) {
  Meteor.publish('recordings', function recordingsPublication() {
    return Recordings.find({});
  });
}

Meteor.methods({
  'recordings.start'() {
    Recordings.remove({}); //fresh recording
    isRecording = true;
  },
  'recordings.stop'() {
    isRecording = false;
  },
  'recordings.insert'(recording) {
    /*
    interaction = {
      state: String,
      action: String,
      params: Array,
      time: Date,
    }
    */
    if(isRecording){
      Recordings.insert(recording);
    }
  }
});