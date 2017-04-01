import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

import { Lines } from './lines';
import { Slides } from './slides';
import { Erase } from './erase';
 
export const Notes = new Mongo.Collection('notes');

Notes.getNotes = () => {
  return Notes.find({slide: Slides.activeSlide('_id')}, { sort: { createdAt: -1 } }).fetch() || [];
}

if (Meteor.isServer) {
  Meteor.publish('notes', function notesPublication() {
    return Notes.find();
  });
}