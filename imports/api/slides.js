import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check, Match } from 'meteor/check';
 
export const Slides = new Mongo.Collection('slides');

if (Meteor.isServer) {
  Meteor.publish('slides', function slidesPublication() {
    return Slides.find();
  });
}

Meteor.methods({
  'slides.insert'(slide) {
    check(slide, {
      active: Boolean,
      number: Number,
      data: String
    });
    slide = Object.assign(slide, {
      createdAt: new Date()
    });
    Slides.insert(slide);
  },
  'slides.move'(request) {
    check(request, Match.OneOf(Number, String));

    const active = Slides.findOne({active: true});

    if(Match.test(request, String)){
      const firstSlide = 1;
      const lastSlide = Slides.find().count();
      const prevSlide = active.number - 1;
      const nextSlide = active.number + 1;
      const moveLeft = _.isEqual(request, 'prev');
      const moveRight = _.isEqual(request, 'next');

      const canMoveLeft = (moveLeft && (prevSlide >= firstSlide));
      const canMoveRight = (moveRight && (nextSlide <= lastSlide));

      if(canMoveLeft){
        Slides.update(active._id, { $set: { active: false } } );
        Slides.update({number: active.number - 1}, {
          $set: { active: true },
        });
      }
      if(canMoveRight){
        Slides.update(active._id, { $set: { active: false } } );
        Slides.update({number: active.number + 1}, {
          $set: { active: true },
        });
      }
    }

    if(Match.test(request, Number)){
      Slides.update(active._id, {
        $set: { active: false },
      });
      Slides.update({number: request}, {
        $set: { active: true },
      });
    }

  },
});