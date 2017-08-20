import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check, Match } from 'meteor/check';
import { Random } from 'meteor/random';
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
      slide: Match.Maybe(String),
      _id: Match.Maybe(String)
    });
    text = Object.assign(text, {
      slide: text.slide || Slides.activeSlide('_id'),
      _id: text._id || Random.id(),
    });
    Meteor.call('recordings.insert', 'text.insert', Array.from(arguments) );
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
      slide: Match.Maybe(String),
      _id: Match.Maybe(String)
    });
    text = Object.assign(text, {
      slide: text.slide || Slides.activeSlide('_id'),
      _id: text._id || Random.id(),
    });
    Meteor.call('recordings.insert', 'text.update', Array.from(arguments) );
    return Notes.update(text._id, text);
  },
});