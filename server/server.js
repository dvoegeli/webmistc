if (Meteor.isServer) {

  Meteor.startup(function () {
    _ = lodash;
  });

  // Slides
  Meteor.publish('slidesCollection', function () {
    return SlidesCollection.find({});
  });

  // Presentations
  Meteor.publish('presentations', function () {
    return Presentations.find({});
  });

  // Presentations
  Meteor.publish('messages', function () {
    return Messages.find({});
  });

  // Questions
  Meteor.publish('questions', function () {
    return Questions.find({});
  });

  Meteor.methods({
    'moveToQuestionPanel': function (name, message, timestamp) {
      // remove from messages
      Messages.remove({
        time: timestamp
      });
      // add to questions
      Questions.insert({
        name: name,
        message: message,
        time: timestamp
      });
    },
    'moveToChatPanel': function (name, message, timestamp) {
      // remove from messages
      Questions.remove({
        time: timestamp
      });
      Messages.insert({
        name: name,
        message: message,
        time: timestamp
      });
    },
    'clear': function (title, number) {
      Presentations.update({_id: title + number}, {
        $set: {overlay: []}
      });
    },
    'markEraser': function (title, number, id) {
      Presentations.update({_id: title + number }, {
        $pull : {
          overlay: { _id : id }
          }
        }
      );
    },
    'markSquiggle': function (title, number, points, color, width) {
      var hasOverlayOnSlide = (Presentations.find({_id: title + number}).count() > 0);
      if (!hasOverlayOnSlide){
        Presentations.insert({_id: title + number, overlay: [] }); 
      }
      Presentations.update({_id: title + number}, {
        $push: {
          overlay: {
            _id: new Mongo.ObjectID()._str,
            type: 'squiggle',
            points: points,
            color: color,
            width: width} 
          } 
        }
      );
    },
    'markLine': function (title, number, x1, y1, x2, y2, color, width) {
      var hasOverlayOnSlide = (Presentations.find({_id: title + number}).count() > 0);
      if (!hasOverlayOnSlide){
        Presentations.insert({_id: title + number, overlay: [] }); 
      }
      Presentations.update({_id: title + number}, {
        $push: {
          overlay: {
            _id: new Mongo.ObjectID()._str,
            type: 'line',
            x1: x1,
            y1: y1,
            x2: x2,
            y2: y2,
            color: color,
            width: width} 
          } 
        }
      );
    },
    'markArrow': function (title, number, x1, y1, x2, y2, color, width) {
      var hasOverlayOnSlide = (Presentations.find({_id: title + number}).count() > 0);
      if (!hasOverlayOnSlide){
        Presentations.insert({_id: title + number, overlay: [] }); 
      }
      Presentations.update({_id: title + number}, {
        $push: {
          overlay: {
            _id: new Mongo.ObjectID()._str,
            type: 'arrow',
            x1: x1,
            y1: y1,
            x2: x2,
            y2: y2,
            color: color,
            width: width} 
          } 
        }
      );
    },
    'markBox': function (title, number, x, y, width, height, fill, color, weight) {
      var hasOverlayOnSlide = (Presentations.find({_id: title + number}).count() > 0);
      if (!hasOverlayOnSlide){
        Presentations.insert({_id: title + number, overlay: [] }); 
      }
      Presentations.update({_id: title + number}, {
        $push: {
          overlay: {
            _id: new Mongo.ObjectID()._str,
            type: 'box',
            x: x,
            y: y,
            width: width,
            height: height,
            fill: fill,
            color: color,
            weight: weight} 
          } 
        }
      );
    },
    'markEllipse': function (title, number, cx, cy, rx, ry, fill, color, weight) {
      var hasOverlayOnSlide = (Presentations.find({_id: title + number}).count() > 0);
      if (!hasOverlayOnSlide){
        Presentations.insert({_id: title + number, overlay: [] }); 
      }
      Presentations.update({_id: title + number}, {
        $push: {
          overlay: {
            _id: new Mongo.ObjectID()._str,
            type: 'circle',
            cx: cx,
            cy: cy,
            rx: rx,
            ry: ry,
            fill: fill,
            color: color,
            weight: weight} 
          } 
        }
      );
    },
    'storeTextbox': function (textbox) {
      var hasOverlayOnSlide = (Presentations.find({_id: textbox.title + textbox.number}).count() > 0);
      if (!hasOverlayOnSlide){
        Presentations.insert({_id: textbox.title + textbox.number, overlay: [] }); 
      }
      var overlay = Presentations.findOne({_id: textbox.title + textbox.number }).overlay;
      console.log('the data:')
      console.log(textbox)
      console.log('what already in the database')
      console.log(overlay)
      if(textbox._id){
        var noteIndex = _.findIndex(overlay, { '_id': textbox._id });
        _.merge(overlay[noteIndex], {
          width: textbox.width,
          height: textbox.height,
          x: textbox.x,
          y: textbox.y,
          text: textbox.text
        })
      } else {
        overlay.push({
          _id: new Mongo.ObjectID()._str,
          type: 'text',
          x: textbox.x,
          y: textbox.y,
          width: textbox.width,
          height: textbox.height,
          color: textbox.color,
          size: textbox.size,
          text: textbox.text,
        })
      }
      Presentations.update({_id: textbox.title + textbox.number }, {
        $set : {
          overlay: overlay
        }
      });
      console.log('--------------------------------------------------------------')
    }
  });

  Router.route('/slides/:filename', function (){
    var fs = Npm.require('fs');
    var path = './assets/app/slides/' + this.params.filename;
    
    // asynchronous
    var _this = this;
    var file = fs.readFile(path, function(err, data){
      if(err){console.log(err);}      
      // out content of the file to the output stream
      _this.response.writeHead(200, {
        'Content-Type': 'application/pdf'
      });
      _this.response.write(data);
      _this.response.end(); 
    });
    // asynchronous
    // var file = fs.readFileSync(path);
    // this.response.writeHead(200, {
    //   'Content-Type': 'application/pdf'
    // });
    // this.response.write(file);
    // this.response.end(); 
  }, {where: 'server'});
}