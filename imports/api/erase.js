import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check, Match } from 'meteor/check';
import { Notes } from './notes';
import { Slides } from './slides';


Meteor.methods({
  'erase.slide'() {
    const slide = Slides.findOne({active: true}) && Slides.findOne({active: true})._id;
    if(slide){
      Notes.remove({slide});
    }
  },
});