import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check, Match } from 'meteor/check';
import { Notes } from './notes.js';

Meteor.methods({
  'lines.insert'(line) {
    check(line, {
      type: String,
      x1: Number,
      y1: Number,
      x2: Number,
      y2: Number,
      color: String,
      size: Number,
    });
    line = Object.assign(line, {
      createdAt: new Date()
    });
    Notes.insert(line);
  },
});