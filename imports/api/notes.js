import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

import { Slides } from './slides';

import { Drawings } from './drawings';
import { Texts } from './texts';
import { Lines } from './lines';
import { Arrows } from './arrows';
import { Boxes } from './boxes';
import { Circles } from './circles';
import { Erase } from './erase';

export const Notes = new Mongo.Collection('notes');

if (Meteor.isServer) {
  Meteor.publish('notes', function notesPublication() {
    return Notes.find();
  });
}

Notes.getNotes = () => {
  return Notes.find({slide: Slides.activeSlide('_id')}, { sort: { createdAt: 1 } }).fetch() || [];
}

Meteor.methods({
  'notes.remove'(id) {
    Meteor.call('recordings.insert', 'notes.remove', Array.from(arguments) );
    Notes.remove(id);
  },
});