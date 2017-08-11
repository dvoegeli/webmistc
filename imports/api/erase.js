import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check, Match } from 'meteor/check';
import { Notes } from './notes';
import { Slides } from './slides';


Meteor.methods({
  'erase.slide'() {
    Meteor.call('recordings.insert', 'erase.slide', Array.from(arguments) );
    const slide = Slides.activeSlide('_id');
    if(slide){
      Notes.remove({slide});
    }
  },
  'erase.presentation'() {
    Meteor.call('recordings.insert', 'erase.presentation', Array.from(arguments) );
    Notes.remove({});
  },
});