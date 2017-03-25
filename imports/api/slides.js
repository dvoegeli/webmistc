import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
 
export const Slides = new Mongo.Collection('slides');

if (Meteor.isServer) {
  Meteor.publish('slides', function slidesPublication() {
    return Slides.find();
  });
}

Meteor.methods({
  'slides.insert'(data) {
    check(data, String);
 
    Slides.insert({
      data,
      createdAt: new Date(),
    });
  },
});