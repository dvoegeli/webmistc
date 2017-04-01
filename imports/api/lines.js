import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check, Match } from 'meteor/check';
import { Notes } from './notes';
import { Slides } from './slides';

import AppState from '/imports/api/appState';

Meteor.methods({
  'lines.insert'(line) {
    check(line, {
      x1: Number,
      y1: Number,
      x2: Number,
      y2: Number,
    });
    line = Object.assign(line, {
      type: 'line',
      color: 'black',
      size: 2,
      slide: Slides.findOne({active: true})._id,
      createdAt: new Date()
    });
    Notes.insert(line);
  },
});