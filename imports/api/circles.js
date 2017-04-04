import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check, Match } from 'meteor/check';
import { Notes } from './notes';
import { Slides } from './slides';
import Colors from './colors';

import AppState from '/imports/api/appState';

Meteor.methods({
  'circle.insert'(circle) {
    check(circle, {
      x1: Number,
      y1: Number,
      x2: Number,
      y2: Number,
      color: String,
      size: Number,
    });
    circle = Object.assign(circle, {
      type: 'circle',
      slide: Slides.activeSlide('_id'),
      createdAt: new Date()
    });
    Notes.insert(circle);
  },
});