if (Meteor.isServer) {

  Meteor.startup(function () {

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

  Meteor.methods({
    'clear': function (title, number) {
      Presentations.update({_id: title + number}, {
        $set: {overlay: []}
      });
    },
    'markEraser': function (title, number, id) {
      Presentations.update({_id: title + number }, {
        $pull : {
          overlay: {
            _id : id}
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
    'markText': function (title, number, x, y, width, height, text, color, size) {
      var hasOverlayOnSlide = (Presentations.find({_id: title + number}).count() > 0);
      if (!hasOverlayOnSlide){
        Presentations.insert({_id: title + number, overlay: [] }); 
      }
      Presentations.update({_id: title + number}, {
        $push: {
          overlay: {
            _id: new Mongo.ObjectID()._str,
            type: 'text',
            x: x,
            y: y,
            width: width,
            height: height,
            text: text,
            color: color,
            size: size}
          } 
        }
      );
    },
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