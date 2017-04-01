import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

import { Lines } from './lines';
import { Erase } from './erase';
 
export const Notes = new Mongo.Collection('notes');

if (Meteor.isServer) {
  Meteor.publish('notes', function notesPublication() {
    return Notes.find();
  });
}