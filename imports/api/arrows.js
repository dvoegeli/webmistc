import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check, Match } from 'meteor/check';
import { Notes } from './notes';
import { Slides } from './slides';

import AppState from '/imports/api/appState';

Meteor.methods({
  'arrow.insert'(arrow) {
    check(arrow, {
      x1: Number,
      y1: Number,
      x2: Number,
      y2: Number,
      color: String,
      size: Number,
    });
    arrow = Object.assign(arrow, {
      type: 'arrow',
      slide: Slides.activeSlide('_id'),
      createdAt: new Date()
    });
    return Notes.insert(arrow);
  },
});