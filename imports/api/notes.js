import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
 
export const Notes = new Mongo.Collection('notes');

if (Meteor.isServer) {
  Meteor.publish('notes', function notesPublication() {
    return Notes.find();
  });
  Notes.insert({type: 'line', x1: 100, y1: 100, x2: 200, y2: 200, size: 2, color: 'black', createdAt: new Date()})
}