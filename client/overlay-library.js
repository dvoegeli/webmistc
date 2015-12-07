OverlayLibrary = function () {
  var self = this;
  var overlay;
  var overlayNode;
  var globalSpace;
  var localSpace;
  var definitions;
  var pathSimplifier = new SimplifyPath();
  init();

  function init() {
    Session.setDefault('overlay.tool', 'pencil');
    Session.setDefault('overlay.cursor', 'pencil');
    Session.setDefault('overlay.color', '#CC2529');
    Session.setDefault('overlay.size', '5px');
    Session.setDefault('overlay.text', '16pt');
    Session.setDefault('overlay.tool.replace', true);
    create();
  };

  function create() {
    overlay = d3.select('#overlay-canvas').append('svg')
      .attr('id', 'overlay-content')
      .attr('preserveAspectRatio', 'xMidYMin meet')
      .attr('viewBox', '0 0 1152 648');
    overlayNode = overlay.node();
    globalSpace = overlayNode.createSVGPoint();
    definitions = overlay.append('defs');
    arrowheads();
  };

  function arrowheads() {
    var colors = $('.overlay-btn-color').toArray();
    _.each(colors, function(element){
      var color = element.attributes['data-color'].value;
      definitions.append("marker")
        .attr('viewBox', '0 0 20 20')
        .attr('id', 'overlay-tool-arrowhead')
        .attr('id', 'overlay-tool-arrowhead-' + color)
        .attr('markerWidth', '10')
        .attr('markerHeight', '10')
        .attr('markerUnits', 'strokeWidth')
        .attr('refX', '1')
        .attr('refY', '5')            
        .attr('orient', 'auto')
        .append('path')
          .attr('d', 'M 0 0 L 10 5 L 0 10 z')
          .attr('fill', color);
    });
  };

  self.createLocalSpace = function(event){
    if(overlayNode){  
      globalSpace.x = event.clientX; 
      globalSpace.y = event.clientY;
      localSpace = globalSpace.matrixTransform(overlayNode.getScreenCTM().inverse());
      localSpace.x = Math.round(localSpace.x);
      localSpace.y = Math.round(localSpace.y);
    }
  }

  self.draw = function(data) {
    self.clear();
    if (overlay) {
      var notes = { 
        squiggle: drawSquiggle,
        line:     drawLine,
        box:      drawBox,
        circle:   drawEllipse,
        text:     drawText,
        arrow:    drawArrow
      }
      _.each(data, function(note){
        notes[note.type](note);
      }); 
    }
  };

  self.clear = function() {
    d3.select('svg').remove();
    create();
  };

  // ERASE ---------------------------------------------------------------------------------------------

  self.useEraserOnce = function(event, title, number) {
    var target = $(event.target);
    var element = target.hasClass('annotation') ? target : target.parent();
    if( element.hasClass('annotation') ){
      var id = element.attr('id');
      element.remove();
      Meteor.call('markEraser', title, number, id);
    }    
  }; 
  // move these next two methods' events out to the template
  self.activateEraser = function(title, number) {
    // change this to the Template.overlay
    $('#overlay-canvas').on('mouseover.annotation', '.annotation', function(){
        var id = this.id;
        $(this).remove();
        Meteor.call('markEraser', title, number, id);    
    });
  };
 
  self.deactivateEraser = function() {
    $('#overlay-canvas').off('.annotation');
  };

  // UNDO ---------------------------------------------------------------------------------------------

  self.undo = function(title, number) {
    var mostRecentNote = $('svg .annotation:last-child');
    var id = mostRecentNote.attr('id');
    mostRecentNote.remove();
    Meteor.call('markEraser', title, number, id);
  };

  // REPLACE ---------------------------------------------------------------------------------------------

  self.replace = function(title, number) {
    var annotations = $('svg .annotation');
    var noteIndex = (annotations.length - 1);
    var noteToReplace = annotations[noteIndex];
    var id = $(noteToReplace).attr('id');
    if(id){
      noteToReplace.remove();
      Meteor.call('markEraser', title, number, id);
    }
  };


  // DRAW -----------------------------------------------------------------------------------------------
  self.markSquiggle = function(title, number) {
    var points = Session.get('overlay.tool.pencil.points'); 
    var color = Session.get('overlay.color');
    var size = Session.get('overlay.size');
    points = pathSimplifier.simplify(points, 3.0, true);
    Meteor.call('markSquiggle', title, number, points, color, size);
  };

  self.markSquiggleStart = function(event) {
    Session.set('overlay.tool.pencil.points', []);
  };

  self.markLine = function(title, number) {
    var x1 = Session.get('overlay.tool.line.x1');
    var y1 = Session.get('overlay.tool.line.y1');
    var x2 = Session.get('overlay.tool.line.x2');
    var y2 = Session.get('overlay.tool.line.y2');
    var color = Session.get('overlay.color');
    var size = Session.get('overlay.size');
    var isTooSmallToSee = _.isEqual(x1, x2) && _.isEqual(y1, y2)
    if(!isTooSmallToSee){
      Meteor.call('markLine', title, number, x1, y1, x2, y2, color, size);
    }
  };
  self.markLineStart = function(event) {
    Session.set('overlay.tool.line.x1', localSpace.x);
    Session.set('overlay.tool.line.y1', localSpace.y);
  };

  self.markLineEnd = function(event) {
    Session.set('overlay.tool.line.x2', localSpace.x);
    Session.set('overlay.tool.line.y2', localSpace.y);
  };

  self.markArrow = function(title, number) {
    var x1 = Session.get('overlay.tool.arrow.x1');
    var y1 = Session.get('overlay.tool.arrow.y1');
    var x2 = Session.get('overlay.tool.arrow.x2');
    var y2 = Session.get('overlay.tool.arrow.y2');
    var color = Session.get('overlay.color');
    var size = Session.get('overlay.size');
    var isTooSmallToSee = _.isEqual(x1, x2) && _.isEqual(y1, y2)
    if(!isTooSmallToSee){
      Meteor.call('markArrow', title, number, x1, y1, x2, y2, color, size);
    }  
  };

  self.markArrowStart = function(event) {
    Session.set('overlay.tool.arrow.x1', localSpace.x);
    Session.set('overlay.tool.arrow.y1', localSpace.y);
  };

  self.markArrowEnd = function(event) {
    Session.set('overlay.tool.arrow.x2', localSpace.x);
    Session.set('overlay.tool.arrow.y2', localSpace.y);
  };

  self.markBox = function(title, number) {
    var x = Session.get('overlay.tool.box.x');
    var y = Session.get('overlay.tool.box.y');
    var width = Session.get('overlay.tool.box.width');
    var height = Session.get('overlay.tool.box.height');
    var color = Session.get('overlay.color');
    var size = Session.get('overlay.size');
    var isTooSmallToSee = _.isEqual(width, 0) || _.isEqual(height, 0)
    if(!isTooSmallToSee){
      Meteor.call('markBox', title, number, x, y, width, height, 'none', color, size);
    }
  };

  self.recoordinateBox = function(event) {
    var origin_x = Session.get('overlay.tool.box.origin.x');
    var origin_y = Session.get('overlay.tool.box.origin.y');
    var corner_x = Session.get('overlay.tool.box.corner.x');
    var corner_y = Session.get('overlay.tool.box.corner.y');
    var width = corner_x - origin_x;
    var height = corner_y - origin_y;

    if( width < 0 ){
      width = Math.abs(width);
      origin_x = corner_x;
      corner_x = Session.get('overlay.tool.box.origin.x');
    }
    if( height < 0 ){
      height = Math.abs(height);
      origin_y = corner_y;
      corner_y = Session.get('overlay.tool.box.origin.y');
    }
    Session.set('overlay.tool.box.x', origin_x);
    Session.set('overlay.tool.box.y', origin_y);
    Session.set('overlay.tool.box.width', width);
    Session.set('overlay.tool.box.height', height );
  };

  self.markBoxOrigin = function(event) {
    Session.set('overlay.tool.box.origin.x', localSpace.x);
    Session.set('overlay.tool.box.origin.y', localSpace.y);
  };

  self.markBoxCorner = function(event) {
    Session.set('overlay.tool.box.corner.x', localSpace.x);
    Session.set('overlay.tool.box.corner.y', localSpace.y);
  };

  self.markEllipse = function(title, number) {
    var cx = Session.get('overlay.tool.ellipse.cx');
    var cy = Session.get('overlay.tool.ellipse.cy');
    var rx = Session.get('overlay.tool.ellipse.rx');
    var ry = Session.get('overlay.tool.ellipse.ry');
    var color = Session.get('overlay.color');
    var size = Session.get('overlay.size');
    var isTooSmallToSee = _.isEqual(rx, 0) || _.isEqual(ry, 0)
    if(!isTooSmallToSee){
      Meteor.call('markEllipse', title, number, cx, cy, rx, ry, 'none', color, size);
    }
  };

  self.recoordinateEllipse = function() {
    var origin_x = Session.get('overlay.tool.ellipse.origin.x');
    var origin_y = Session.get('overlay.tool.ellipse.origin.y');
    var corner_x = Session.get('overlay.tool.ellipse.corner.x');
    var corner_y = Session.get('overlay.tool.ellipse.corner.y');
    var width = corner_x - origin_x;
    var height = corner_y - origin_y;

    if( width < 0 ){
      width = Math.abs(width);
      origin_x = corner_x;
      corner_x = Session.get('overlay.tool.ellipse.origin.x');
    }
    if( height < 0 ){
      height = Math.abs(height);
      origin_y = corner_y;
      corner_y = Session.get('overlay.tool.ellipse.origin.y');
    }

    var radius_x = width/2;
    var radius_y = height/2;
    var center_x = origin_x + radius_x;
    var center_y = origin_y + radius_y;
    Session.set('overlay.tool.ellipse.cx', center_x);
    Session.set('overlay.tool.ellipse.cy', center_y);
    Session.set('overlay.tool.ellipse.rx', radius_x);
    Session.set('overlay.tool.ellipse.ry', radius_y);
  };

  self.markEllipseOrigin = function(event) {
    Session.set('overlay.tool.ellipse.origin.x', localSpace.x);
    Session.set('overlay.tool.ellipse.origin.y', localSpace.y);
  };

  self.markEllipseCorner = function(event) {
    Session.set('overlay.tool.ellipse.corner.x', localSpace.x);
    Session.set('overlay.tool.ellipse.corner.y', localSpace.y);
  };

  self.markText = function(title, number) {
    var x = Session.get('overlay.tool.text.x');
    var y = Session.get('overlay.tool.text.y');
    var width = Session.get('overlay.tool.text.width');
    var height = Session.get('overlay.tool.text.height');
    var text = Session.get('overlay.tool.text.text');
    var color = Session.get('overlay.color');
    var size = Session.get('overlay.text');
    Meteor.call('markText', title, number, x, y, width, height, text, color, size);
  };
  // PLACE  -----------------------------------------------------------------------------------------------
  self.placeLine = function() {
    d3.select('#overlay_place_line').remove();
    overlay.append('line')
      .attr('id','overlay_place_line' )
      .attr('x1', Session.get('overlay.tool.line.x1') )
      .attr('y1', Session.get('overlay.tool.line.y1') )
      .attr('x2', Session.get('overlay.tool.line.x2') )
      .attr('y2', Session.get('overlay.tool.line.y2') )
      .attr('stroke-width', Session.get('overlay.size') )
      .attr('stroke', Session.get('overlay.color') );
  };

  self.placeArrow = function() {
    var x1 = Session.get('overlay.tool.arrow.x1');
    var y1 = Session.get('overlay.tool.arrow.y1');
    var x2 = Session.get('overlay.tool.arrow.x2');
    var y2 = Session.get('overlay.tool.arrow.y2');
    var isTooSmallToSee = _.isEqual(x1, x2) && _.isEqual(y1, y2)
    if(!isTooSmallToSee){
      d3.select('#overlay_place_arrow').remove();
      overlay.append('line')
        .attr('id','overlay_place_arrow')
        .attr('marker-end', 'url(#overlay-tool-arrowhead-' + Session.get('overlay.color') +')' )
        .attr('x1', Session.get('overlay.tool.arrow.x1') )
        .attr('y1', Session.get('overlay.tool.arrow.y1') )
        .attr('x2', Session.get('overlay.tool.arrow.x2') )
        .attr('y2', Session.get('overlay.tool.arrow.y2') )
        .attr('stroke-width', Session.get('overlay.size') )
        .attr('stroke', Session.get('overlay.color') );
    }
  };

  self.placeBox = function() {
    d3.select('#overlay_place_box').remove();
    overlay.append('rect')
      .attr('id','overlay_place_box')
      .attr('x', Session.get('overlay.tool.box.x') )
      .attr('y', Session.get('overlay.tool.box.y') )
      .attr('width', Session.get('overlay.tool.box.width') )
      .attr('height', Session.get('overlay.tool.box.height') )
      .attr('fill', 'none')
      .attr('stroke-width', Session.get('overlay.size') )
      .style('stroke', Session.get('overlay.color') );
  };

  self.placeEllipse = function() {
    d3.select('#overlay_place_ellipse').remove();
    overlay.append('ellipse')
      .attr('id','overlay_place_ellipse')
      .attr('cx', Session.get('overlay.tool.ellipse.cx') )
      .attr('cy', Session.get('overlay.tool.ellipse.cy') )
      .attr('rx', Session.get('overlay.tool.ellipse.rx') )
      .attr('ry', Session.get('overlay.tool.ellipse.ry') )
      .attr('fill', 'none')
      .attr('stroke-width', Session.get('overlay.size') )
      .style('stroke', Session.get('overlay.color') );
  };

  function squigglePointGenerator(points){
    return (
      d3.svg.line()
        .x(function(d) { return d.x; })
        .y(function(d) { return d.y; })
        .interpolate('cardinal')
    )(points);
  }

  self.placeSquiggle = function(event) {
    var offset = $('#overlay-canvas').offset();
    var xCoord = (event.pageX - offset.left);
    var yCoord = (event.pageY - offset.top);

    var points = Session.get('overlay.tool.pencil.points');
    points.push({x: localSpace.x, y: localSpace.y});
    Session.set('overlay.tool.pencil.points', points);

    var points = pathSimplifier.simplify(points, 3.0, true);

    d3.select('#overlay_place_pencil').remove();
    overlay.append('path')
      .attr('id','overlay_place_pencil')
      .attr('d', squigglePointGenerator(points))
      .attr('fill', 'none')
      .attr('stroke-width', Session.get('overlay.size'))
      .attr('stroke', Session.get('overlay.color'));
  };

  self.attachText = function(title, number){
    var textArea = $('#overlay-place-textarea');
    var width = textArea.width();
    var height = textArea.height();
    var text = textArea.val();
    if(text){
      text = text.replace(/\n/g, '<br>');  // repalce javascript newlines with html breaks
      
      Session.set('overlay.tool.text.width', width);
      Session.set('overlay.tool.text.height', height);
      Session.set('overlay.tool.text.text', text);

      d3.select('#overlay-place-text').remove();
      self.markText(title, number);
    }    
  };

  self.cancelText = function(){
    d3.select('#overlay-place-text').remove();  
  }

  self.placeText = function(title, number, event) {
    var size = Session.get('overlay.text');
    var color = Session.get('overlay.color');
    
    var x = localSpace.x;
    var y = localSpace.y;

    Session.set('overlay.tool.text.x', x);
    Session.set('overlay.tool.text.y', y);

    d3.select('#overlay-place-text').remove();
    var wrapper = overlay.append('foreignObject')
      .attr('id','overlay-place-text') // refactor out name somehow, pass in through parameter
      .attr('x', x)
      .attr('y', y)
      .attr('width', '600px')
      .attr('height', '3000px')
    var textArea = wrapper.append('xhtml:textarea')
      .attr('id','overlay-place-textarea') // refactor out name somehow, pass in through parameter
      .attr('class', 'text-tool-input')
      .attr('wrap','hard')
      .attr('resize', 'none')      
      .attr('placeholder', 'Press enter when done.\nPress shift+enter for new line.')
      .style('font-size', size)
      .style('color', color)
      .style('width', '300px') // place these into a stylesheet
      .style('min-width', '100px')
      .style('padding', '0px 5px');
    var holder = wrapper.append('xhtml:div') // refactor out name somehow, pass in through parameter
      .attr('id','overlay-place-holder')
      .attr('class', 'text-tool-input')
      .attr('wrap','hard')
      .style('font-size', size)
      .style('max-width', '600px') // place these into a stylesheet
      .style('min-width', '100px') // place these into a stylesheet
      .style('display', 'none')
      .style('padding', '0px 5px');

    $('#overlay-place-textarea').focus();
    $('#overlay-place-textarea').autosize();
  };

  self.autoresizeTextInput = function(event) {
    var $text = $(event.target);
    var $holder = $('#overlay-place-holder'); //refactor these names out
    var $wrapper = $('#overlay-place-text');  // refactor out, pass in through parameters

    $holder.text( $text.val() );
    var width = Number( $holder.css("width").slice(0,-2) ) + 20 + 'px';
    $text.css( "width", width);
  }

  // DRAW -----------------------------------------------------------------------------------------------
  function drawText(note) {
    overlay.append('foreignObject')
      .attr('id', note._id)
      .attr('class', 'annotation')
      .attr('x', note.x)
      .attr('y', note.y)
      .attr('width', note.width)
      .attr('height', note.height)
      .append('xhtml:textarea')
        .attr('class', 'annotation-text')
        .attr('wrap','hard')
        .style('font-size', note.size)
        .style('width', note.width)
        .style('height', note.height)
        .style('color', note.color)
        .html(note.text);
        // this is very vulernable to injection attacks due to using html instead of text
        // the reason html is used is to preserve whitespace and line breaks
  };

  function drawSquiggle(note) { 
    overlay.append('path')
      .attr('id', note._id)
      .attr('class', 'annotation')
      .attr('d', squigglePointGenerator(note.points) )
      .attr('fill', 'none')
      .attr('stroke-width', note.width)
      .attr('stroke', note.color);
  }; 

  function drawLine(note) {
    overlay.append('line')
      .attr('id', note._id)
      .attr('class', 'annotation')
      .attr('x1', note.x1)
      .attr('y1', note.y1)
      .attr('x2', note.x2)
      .attr('y2', note.y2)
      .attr('stroke-width', note.width)
      .attr('stroke', note.color);
  };    

  function drawArrow(note) {
    overlay.append('line')
      .attr('id', note._id)
      .attr('class', 'annotation arrow')
      .attr('marker-end', 'url(#overlay-tool-arrowhead-' + note.color +')' )
      .attr('x1', note.x1)
      .attr('y1', note.y1)
      .attr('x2', note.x2)
      .attr('y2', note.y2)
      .attr('stroke-width', note.width)
      .attr('stroke', note.color);
};

  function drawBox(note) {
    overlay.append('rect')
      .attr('id', note._id)
      .attr('class', 'annotation')
      .attr('x', note.x)
      .attr('y', note.y)
      .attr('width', note.width)
      .attr('height', note.height)
      .attr('stroke-width', note.weight)
      .attr('fill', note.fill)
      .style('stroke', note.color);
  };

  function drawEllipse(note) {
    overlay.append('ellipse')
      .attr('id', note._id)
      .attr('class', 'annotation')
      .attr('cx', note.cx)
      .attr('cy', note.cy)
      .attr('rx', note.rx)
      .attr('ry', note.ry)
      .attr('stroke-width', note.weight)
      .attr('fill', note.fill)
      .style('stroke', note.color);
  };
}