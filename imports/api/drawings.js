import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check, Match } from 'meteor/check';
import { Random } from 'meteor/random';
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
      size: String,
      slide: Match.Maybe(String),
      _id: Match.Maybe(String),
    });
    drawing = Object.assign(drawing, {
      slide: drawing.slide || Slides.activeSlide('_id'),
      _id: drawing._id || Random.id(),
    });
    Meteor.call('recordings.insert', 'drawing.insert', Array.from(arguments) );
    return Notes.insert(drawing);
  },
});
