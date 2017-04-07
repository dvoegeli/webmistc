import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check, Match } from 'meteor/check';
import { Notes } from './notes';
import { Slides } from './slides';

import AppState from '/imports/api/appState';

Meteor.methods({
  'drawing.insert' (drawing) {
    check(drawing, {
      type: String,
      data: {
        coords: [{
          x: Number,
          y: Number,
        }]
      },
      color: String,
      size: Number,
    });
    drawing = Object.assign(drawing, {
      slide: Slides.activeSlide('_id'),
      createdAt: new Date()
    });
    return Notes.insert(drawing);
  },
});
