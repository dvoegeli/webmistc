import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check, Match } from 'meteor/check';
import { Notes } from './notes';
 
export const StickyNotes = new Mongo.Collection('stickyNotes');

const initialState = {
  nextNote: undefined,
}

if (Meteor.isServer) {
  Meteor.publish('stickyNotes', function stickyNotesPublication() {
    return StickyNotes.find();
  });
  StickyNotes.upsert({}, initialState);
}

Meteor.methods({
  'stickyNotes.reset'() {
    StickyNotes.update({}, { $set: { nextNote: undefined } });
  },
  'stickyNotes.next'(note) {
    check(note, String);
    const nextNote = StickyNotes.findOne({}).nextNote;
    if(nextNote){
      Notes.remove(nextNote);
    }
    StickyNotes.update({}, { $set: {nextNote: note} });
  },
});