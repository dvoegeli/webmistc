import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check, Match } from 'meteor/check';
import _ from 'lodash';

export const Slides = new Mongo.Collection('slides');

if (Meteor.isServer) {
  Meteor.publish('slides', function slidesPublication() {
    return Slides.find();
  });
}

Slides.activeSlide = (attr) => {
  const slide = Slides.findOne({ active: true });
  return slide ? (attr ? slide[attr] : slide) : undefined;
}

// pared collection is filtered on slide.number and slide._id 
Slides.paredCollection = () => {
  return Slides.find({}, {
    fields: { _id: true, number: true },
    sort: { number: 1 }
  }).fetch();
}

// slides collection to save, excluding '_id' 
Slides.saveCollection = () => {
  return Slides.find({}, {
    fields: { _id: false },
    sort: { number: 1 }
  }).fetch();
}

Meteor.methods({
  'slides.insert' (location, slide) {
    check(location, Number);
    check(slide, {
      number: Number,
      data: String
    });
    const active = _.isEqual(slide.number, 1);
    const number = slide.number + location;
    slide.number = Object.assign(slide, {
      number
    });
    const hasSlides = !_.isEqual(location, 0);
    if(hasSlides){
      Meteor.call('slides.active', location, false);
    }
    Slides.insert(slide);
    Meteor.call('slides.active', number, active);
  },
  'slides.offset' (amount) {
    check(amount, Number);
    const activeSlide = Slides.activeSlide();
    const slides = Slides.paredCollection();
    _.forEach(slides, (slide) => {
      const canShiftSlides = slide.number > activeSlide.number;
      const number = canShiftSlides ? (slide.number + amount) : slide.number;
      Slides.update(slide._id, {
        $set: { number },
      });
    });
  },
  'slides.blank' (slide) {
    check(slide, {
      data: String
    });
    const activeSlide = Slides.activeSlide(); 
    const number = (activeSlide && activeSlide.number + 1) || 1;
    slide = Object.assign(slide, {
      number
    });
    if(activeSlide){
      Meteor.call('slides.active', activeSlide.number, false);
    }
    Slides.insert(slide);
    Meteor.call('slides.active', number, true);
  },
  'slides.delete'() {
    const activeSlide = Slides.activeSlide();
    if(!activeSlide) return; 
    const isLastSlide = Slides.find().count();
    Slides.remove(activeSlide._id);
    if(!!isLastSlide){
      const isDeletingLastSlide = _.isEqual(activeSlide.number, isLastSlide);
      const number = activeSlide.number + (isDeletingLastSlide ? -1 : 0);
      Meteor.call('slides.active', number, true);
    }
  },
  'slides.reset' () {
    Slides.remove({});
  },
  'slides.move' (request) {
    check(request, Match.OneOf(Number, String));

    const active = Slides.activeSlide();

    if (Match.test(request, String)) {
      const firstSlide = 1;
      const lastSlide = Slides.find().count();
      const prevSlide = active.number - 1;
      const nextSlide = active.number + 1;
      const moveLeft = _.isEqual(request, 'prev');
      const moveRight = _.isEqual(request, 'next');

      const canMoveLeft = (moveLeft && (prevSlide >= firstSlide));
      const canMoveRight = (moveRight && (nextSlide <= lastSlide));

      if (canMoveLeft) {
        Meteor.call('slides.active', active.number, false);
        Meteor.call('slides.active', active.number - 1, true);
      }
      if (canMoveRight) {
        Meteor.call('slides.active', active.number, false);
        Meteor.call('slides.active', active.number + 1, true);
      }
    }
    if (Match.test(request, Number)) {
      Meteor.call('slides.active', active.number, false);
      Meteor.call('slides.active', request, true);
    }
  },
  'slides.active' (number, active) {
    check(number, Number);
    check(active, Boolean);
    Slides.update({ number }, { $set: { active } });
  },
});
