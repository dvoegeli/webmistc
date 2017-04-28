import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check, Match } from 'meteor/check';
import { Notes } from './notes';
import { Slides } from './slides';

import AppState from '/imports/api/appState';

Meteor.methods({
  'text.insert'(text) {
    check(text, {
      type: String,
      data: {
        coords: [{
          x: Number,
          y: Number,
        }],
      },
      color: String,
      size: String,
    });
    text = Object.assign(text, {
      slide: Slides.activeSlide('_id'),
      createdAt: new Date()
    });
    return Notes.insert(text);
  },
  'text.update'(text) {
    check(text, {
      _id: String,
      type: String,
      data: {
        coords: [{
          x: Number,
          y: Number,
        }],
        text: String,
      },
      color: String,
      size: String,
    });
    text = Object.assign(text, {
      slide: Slides.activeSlide('_id'),
      createdAt: new Date()
    });
    return Notes.update(text._id, text);
  },
});