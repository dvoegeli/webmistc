import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check, Match } from 'meteor/check';
import { Notes } from './notes';
import { Slides } from './slides';

import AppState from '/imports/api/appState';

Meteor.methods({
  'circle.insert'(circle) {
    check(circle, {
      type: String,
      data: {
        x1: Number,
        y1: Number,
        x2: Number,
        y2: Number,
      },
      color: String,
      size: Number,
    });
    circle = Object.assign(circle, {
      slide: Slides.activeSlide('_id'),
      createdAt: new Date()
    });
    return Notes.insert(circle);
  },
});