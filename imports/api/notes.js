import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

import { Slides } from './slides';

import { Erase } from './erase';
import { Lines } from './lines';
import { Arrows } from './arrows';
import { Boxes } from './boxes';
import { Circles } from './circles';
import { Drawings } from './drawings';

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
    Notes.remove(id);
  },
});