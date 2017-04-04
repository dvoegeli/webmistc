import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

import { Slides } from './slides';

import { Lines } from './lines';
import { Arrows } from './arrows';
import { Boxes } from './boxes';
import { Circles } from './circles';
import { Erase } from './erase';
 
export const Notes = new Mongo.Collection('notes');

Notes.getNotes = () => {
  return Notes.find({slide: Slides.activeSlide('_id')}, { sort: { createdAt: 1 } }).fetch() || [];
}

if (Meteor.isServer) {
  Meteor.publish('notes', function notesPublication() {
    return Notes.find();
  });
}