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
Slides.numbers = () => {
  return Slides.find({}, {
    fields: { _id: true, number: true },
    sort: { number: 1 }
  }).fetch();
}

Meteor.methods({
  'slides.insert' (slide) {
    check(slide, {
      active: Boolean,
      number: Number,
      data: String
    });
    slide = Object.assign(slide, {
      createdAt: new Date()
    });
    const count = Slides.find({}).count();
    Slides.insert(slide);

  },
  'slides.append' (location, slide) {
    check(slide, {
      active: Boolean,
      number: Number,
      data: String
    });
    check(location, Number);
    const count = Slides.find({}).count();
    slide = Object.assign(slide, {
      createdAt: new Date(),
      number: location + slide.number,
    });
    Slides.insert(slide);   
  },
  'slides.blank' (slide) {
    check(slide, {
      data: String
    });

    const activeSlide = Slides.activeSlide('number') || 0;

    const slides = Slides.numbers();
    _.forEach(slides, (slide) => {
      const number = (slide.number > activeSlide) ? slide.number + 1 : slide.number; 
      Slides.update(slide._id, {
        $set: { 
          number,
          active: false,
        },
      });
    })
    slide = Object.assign(slide, {
      active: true,
      number: activeSlide + 1,
      createdAt: new Date()
    });
    Slides.insert(slide);

  },
  'slides.delete'() {
    let slides = Slides.numbers();
    if(!slides) return;
    
    const activeSlide = Slides.activeSlide();
    
    if(_.isEqual(slides.length, 1)){
      Slides.remove(activeSlide._id);
      return;
    }

    if(_.isEqual(slides.length, 2)){
      Slides.remove(activeSlide._id);
      Slides.update({}, {
        $set: { active: true, number: 1 },
      });
      return;
    }

    const isDeletingLast = _.isEqual(activeSlide.number, slides.length);
    Slides.remove(activeSlide._id);
    slides = Slides.numbers();
    _.forEach(slides, (slide) => {
      const canShiftSlide = (slide.number > activeSlide.number);
      const number = canShiftSlide? slide.number - 1 : slide.number;
      const atBeforeActive = _.isEqual(slide.number, activeSlide.number - 1);
      const atAfterActive = _.isEqual(slide.number, activeSlide.number + 1)
      const active = (isDeletingLast && atBeforeActive) || atAfterActive;
      Slides.update(slide._id, { $set: { number, active } });
    })
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
