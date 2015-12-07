SlideLibrary = function (_title) {
  var title = _title;
  PDFJS.workerSrc = '/packages/pascoual_pdfjs/build/pdf.worker.js';
  var self = this;
  var slides;

  var create = function() {
    $('#slide').append('<canvas id="slide-canvas"> </canvas>');
  };
  create();

  self.clear = function() {
    $('#slide-canvas').remove();
    create();
  };

  self.title = function() {
    return title;
  };

  self.set = function(_slides) {
    slides = _slides;
  };
  self.get = function() {
    return slides;
  };
  self.getPage = function(request){
    var number = Session.get('slide.page');
    number = ('next'  === request) ? (number += 1) : number;
    number = ('prev'  === request) ? (number -= 1) : number;
    number = ('first' === request) ?            1  : number;
    number = (_.isNumber(request)) ?      request  : number;
    return number;
  }
  self.setPage = function(number){
    Session.set('slide.page', number);
    SlidesCollection.update({_id: self.title()}, {
      $set: {page: number}
    });
  }
  self.render = function(request){
    if(slides){
      self.clear(); 
      var number = self.getPage(request);
      slides.getPage(number).then(function (page) {
        self.setPage(number);
        var scale = 3;
        var viewport = page.getViewport(scale);
        // Prepare canvas using slide page dimensions
        var canvas = $('#slide-canvas')[0];
        var context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        // Render slide page into canvas context
        page.render({canvasContext: context, viewport: viewport}).promise.then(function () {
        });
      });
    }
  }
}