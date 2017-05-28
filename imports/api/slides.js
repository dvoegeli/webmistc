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

Meteor.methods({
  'slides.insert' (location, slide) {
    // broken is trying to append to end
    // likely, it's because the shift is broken
    check(location, Number);
    check(slide, {
      number: Number,
      data: String
    });
    const active = _.isEqual(slide.number, 1);
    const number = slide.number + location;
    slide = Object.assign(slide, {
      createdAt: new Date(),
      active,
      number
    });
    const hasSlides = !_.isEqual(location, 0);
    if(hasSlides){
      Slides.update({ number: location }, {
        $set: { 
          active: false,
        },
      });
    }
    Slides.insert(slide);
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
      createdAt: new Date(),
      active: true,
      number
    });
    if(activeSlide){
      Slides.update(activeSlide._id, {
        $set: { 
          active: false,
        },
      });
    }
    Slides.insert(slide);

  },
  'slides.delete'() {
    const activeSlide = Slides.activeSlide();
    if(!activeSlide) return; 
    const isLastSlide = Slides.find().count();
    Slides.remove(activeSlide._id);
    if(!!isLastSlide){
      const isDeletingLastSlide = _.isEqual(activeSlide.number, isLastSlide);
      const number = activeSlide.number + (isDeletingLastSlide ? -1 : 0);
      Slides.update({ number }, { 
        $set: { 
          active: true,
        } 
      });
    }
  },
  'slides.reset' () {
    Slides.remove({});
  },
  'slides.move' (request) {
    check(request, Match.OneOf(Number, String));

    const active = Slides.findOne({ active: true });

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
        Slides.update(active._id, { $set: { active: false } });
        Slides.update({ number: active.number - 1 }, {
          $set: { active: true },
        });
      }
      if (canMoveRight) {
        Slides.update(active._id, { $set: { active: false } });
        Slides.update({ number: active.number + 1 }, {
          $set: { active: true },
        });
      }
    }

    if (Match.test(request, Number)) {
      Slides.update(active._id, {
        $set: { active: false },
      });
      Slides.update({ number: request }, {
        $set: { active: true },
      });
    }

  },
});
