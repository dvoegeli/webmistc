import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check, Match } from 'meteor/check';
import { Random } from 'meteor/random';
import { Notes } from './notes';
import { Slides } from './slides';

import AppState from '/imports/api/appState';

Meteor.methods({
  'box.insert'(box) {
    check(box, {
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
    box = Object.assign(box, {
      slide: box.slide || Slides.activeSlide('_id'),
      _id: box._id || Random.id(),
    });
    Meteor.call('recordings.insert', 'box.insert', Array.from(arguments) );
    return Notes.insert(box);
  },
});