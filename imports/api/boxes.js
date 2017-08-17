import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check, Match } from 'meteor/check';
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
      slide: Match.Maybe(String)
    });
    box = Object.assign(box, {
      slide: Slides.activeSlide('_id')
    });
    Meteor.call('recordings.insert', 'box.insert', Array.from(arguments) );
    return Notes.insert(box);
  },
});