import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
 
export const Slides = new Mongo.Collection('slides');

Meteor.methods({
  'slides.insert'(slide) {
    check(slide, String);
 
    Slides.insert({
      slide,
      createdAt: new Date(),
    });
  },
});