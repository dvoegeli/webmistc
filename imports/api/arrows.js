import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check, Match } from 'meteor/check';
import { Random } from 'meteor/random';
import { Notes } from './notes';
import { Slides } from './slides';

import AppState from '/imports/api/appState';

Meteor.methods({
  'arrow.insert'(arrow) {
    check(arrow, {
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
    arrow = Object.assign(arrow, {
      slide: arrow.slide || Slides.activeSlide('_id'),
      _id: arrow._id || Random.id(),
    });
    Meteor.call('recordings.insert', 'arrow.insert', Array.from(arguments) );
    return Notes.insert(arrow);
  },
});