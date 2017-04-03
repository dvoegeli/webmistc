import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check, Match } from 'meteor/check';
import { Notes } from './notes';
import { Slides } from './slides';

import AppState from '/imports/api/appState';

Meteor.methods({
  'boxes.insert'(box) {
    check(box, {
      x1: Number,
      y1: Number,
      x2: Number,
      y2: Number,
    });
    box = Object.assign(box, {
      type: 'box',
      color: 'black',
      size: 2,
      slide: Slides.activeSlide('_id'),
      createdAt: new Date()
    });
    Notes.insert(box);
  },
});