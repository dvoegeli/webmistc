import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check, Match } from 'meteor/check';
import { Random } from 'meteor/random';
import { Notes } from './notes';
import { Slides } from './slides';

import AppState from '/imports/api/appState';

Meteor.methods({
  'line.insert'(line) {
    check(line, {
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
      _id: Match.Maybe(String)
    });
    line = Object.assign(line, {
      slide: line.slide || Slides.activeSlide('_id'),
      _id: line._id || Random.id(),
    });
    Meteor.call('recordings.insert', 'line.insert', Array.from(arguments) );
    return Notes.insert(line);
  },
});