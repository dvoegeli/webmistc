import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Chats = new Mongo.Collection('chats');

if (Meteor.isServer) {
  Meteor.publish('chats', function chatsPublication() {
    return Chats.find();
  });
}

Meteor.methods({
  'chats.insert' (message) {
    check(message, {
      username: String,
      text: String
    });
    message = Object.assign(message, {
      createdAt: new Date(),
    });
    Meteor.call('recordings.insert', 'chats.insert', Array.from(arguments) );
    Chats.insert(message);
  },
  'chats.reset' () {
    Meteor.call('recordings.insert', 'chats.reset', Array.from(arguments) );
    Chats.remove({});
  },
});
