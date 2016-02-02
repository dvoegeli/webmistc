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
    Session.setDefault('overlay.size.outline', '5');
    Session.setDefault('overlay.size.font', '16');
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

  // TOOL COLOR -----------------------------------------------------------------------------------------
  var toolColor = {
    current: Session.get('overlay.color'),
    codes: ['#396AB1', '#DA7C30', '#3E9651', '#CC2529', '#535154', '#6B4C9A', '#922428','#948B3D']
  }

  self.cycleLeftToolColor = function(){
    toolColor.current = leftOfElementInArray(toolColor.current, toolColor.codes);
    return toolColor.current;
  }

  self.cycleRightToolColor = function(){
    toolColor.current = rightOfElementInArray(toolColor.current, toolColor.codes);
    return toolColor.current;
  }

  // TOOL SIZE -----------------------------------------------------------------------------------------
  var toolSize = {
    current: Session.get('overlay.size.outline'),
    codes: ['3', '5', '8', '13', '21']
  }

  self.cycleLeftToolSize = function(){
    toolSize.current = leftOfElementInArray(toolSize.current, toolSize.codes);
    return toolSize.current;
  }

  self.cycleRightToolSize = function(){
    toolSize.current = rightOfElementInArray(toolSize.current, toolSize.codes);
    return toolSize.current;
  }  

  // TEXT SIZE -----------------------------------------------------------------------------------------
  var textSize = {
    current: Session.get('overlay.size.font'),
    codes: [14, 18, 24, 32, 42]
  }

  self.cycleLeftTextSize = function(){
    textSize.current = leftOfElementInArray(parseInt(textSize.current), textSize.codes)
    return textSize.current;
  }

  self.cycleRightTextSize = function(){
    textSize.current = rightOfElementInArray(parseInt(textSize.current), textSize.codes);
    return textSize.current;
  }  

  // UTILITIES ----------------------------------------------------------------------------------------
 function leftOfElementInArray (element, array){
    var leftOfElement = element;
    var index = _.indexOf(array, element);
    var isElementInArray = !_.isEqual(index, -1);
    if( isElementInArray ){
      index = (index - 1 >= 0) ? (index - 1) : (array.length - 1);
      leftOfElement = array[index];
    }
    return leftOfElement;
  }

  function rightOfElementInArray (element, array){
    var rightOfElement = element;
    var index = _.indexOf(array, element);
    var isElementInArray = !_.isEqual(index, -1);
    if( isElementInArray ){
      index = (index + 1 < array.length) ? (index + 1) : 0;
      rightOfElement = array[index];
    }
    return rightOfElement;
  }

  // ERASE ---------------------------------------------------------------------------------------------

  self.useEraserOnce = function(event, title, number) {
    // TODO rewrite to use d3 instead of jquery
    // also, all targets should be an html node, not the raw event object
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
    var latestNote = $('svg .annotation').last();
    var id = latestNote.attr('id');
    latestNote.remove();
    Meteor.call('markEraser', title, number, id);
  };

  // REPLACE ---------------------------------------------------------------------------------------------

  self.replaceNote = function( whichNote, title, number) {
    var jqNote;
    switch(whichNote){
      case 'latest':
        jqNote = $('svg .annotation').last();
        break;
      case 'previous':
        jqNote = $('svg .annotation:nth-last-child(2)').first();
        break;
    }
    var id = jqNote.attr('id');
    jqNote.remove();
    if(id){
      Meteor.call('markEraser', title, number, id);
    }
  };

  // DRAW -----------------------------------------------------------------------------------------------
  self.markSquiggle = function(title, number) {
    var points = Session.get('overlay.tool.pencil.points'); 
    var color = Session.get('overlay.color');
    var size = Session.get('overlay.size.outline');
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
    var size = Session.get('overlay.size.outline');
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
    var size = Session.get('overlay.size.outline');
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
    var size = Session.get('overlay.size.outline');
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
    var size = Session.get('overlay.size.outline');
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

  // PLACE  -----------------------------------------------------------------------------------------------
  self.placeLine = function() {
    d3.select('#overlay_place_line').remove();
    overlay.append('line')
      .attr('id','overlay_place_line' )
      .attr('x1', Session.get('overlay.tool.line.x1') )
      .attr('y1', Session.get('overlay.tool.line.y1') )
      .attr('x2', Session.get('overlay.tool.line.x2') )
      .attr('y2', Session.get('overlay.tool.line.y2') )
      .attr('stroke-width', Session.get('overlay.size.outline') )
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
        .attr('stroke-width', Session.get('overlay.size.outline') )
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
      .attr('stroke-width', Session.get('overlay.size.outline') )
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
      .attr('stroke-width', Session.get('overlay.size.outline') )
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
      .attr('stroke-width', Session.get('overlay.size.outline'))
      .attr('stroke', Session.get('overlay.color'));
  };

  // DRAW -----------------------------------------------------------------------------------------------
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

  // spin out into a utility library, this is useful everywhere
  function updateSessionObject (id, attributes) {
    var object = Session.get(id);
    _.each(attributes, function(value, key) {
      object[key] = value;
    })
    Session.set(id, object);
  }

  // TEXT --------------------------------------------------------------------------
  Session.setDefault('overlay.tool.textbox', {});

  self.storeTextbox = function(title, number, domTextInput) { 
    // console.log('storing textbox, before updates')
    // console.log(domTextInput)  
    var jqTextInput = $(domTextInput);
    var jqTextBox = jqTextInput.parent().parent();
    var text = jqTextInput.text();
    if(text){
      updateSessionObject('overlay.tool.textbox', {
        title: title,
        number: number,
        text: text,
        height: jqTextInput.css('height'),
        width: jqTextInput.css('width'),
        x: jqTextBox.attr('data-x'),
        y: jqTextBox.attr('data-y'),
      });
      if (jqTextBox.attr('id')){
        updateSessionObject('overlay.tool.textbox', {
          _id: jqTextBox.attr('id')
        });
      }
      // console.log('##########################################')
      // console.log('storing textbox, after updates')
      // console.log(Session.get('overlay.tool.textbox'))
      // console.log('##########################################')
      Meteor.call('storeTextbox', Session.get('overlay.tool.textbox'));
    }    
  }; 

  self.placeText = function(title, number) {
    var x = localSpace.x;
    var y = localSpace.y;
    var size = parseInt( Session.get('overlay.size.font') );
    var color = Session.get('overlay.color');

    Session.set('overlay.tool.textbox', {});
    updateSessionObject('overlay.tool.textbox', {
      x: x,
      y: y,
      size: size,
      color: color
    });   

    var textbox = overlay.append('g')
      .attr({
        class: 'annotation annotation-text-box',
        'data-x': x,
        'data-y': y,
        'data-x-origin': x,
        'data-y-origin': y,
      });
    var handle = textbox.append('rect')
      .attr({
        class: 'annotation-text-handle',
        'min-height': size + 'px',
        x: x - 20 + 'px',
        y: y,
        width: '20px',
      });
    var background = textbox.append('rect')
      .attr({
        class: 'annotation-text-background',
        'min-width': (size * 5) + 'px',
        'min-height': size + 'px',
        x: x,
        y: y,
      });
    var text = textbox.append('foreignObject')
      .attr({
        class: 'annotation-text-container',
        height: '600px',
        width: '600px',
        x: x,
        y: y,
      });
      var input = text.append('xhtml:span')
        .attr({
          class: 'annotation-text annotation-text-active annotation-text-input',
          'data-placeholder': 'Press enter when done\nShift+enter for new line.',
          contenteditable: '',
          wrap: 'hard',
        })        
        .style({
          color: color,
          'font-size': size + 'px',
          'max-width': '600px',
          'min-width': (size * 5) + 'px',
          'min-height': size + 'px',
        });
    input.node().focus();
    // change background and handle to match text
    var bounding = {
      height: parseInt( $( input.node() ).css( 'height' ) ), 
      width: parseInt( $( input.node() ).css( 'width' ) ), 
    }
    handle.attr( 'height', bounding.height );    
    background.attr( 'width', bounding.width);
    background.attr( 'height', bounding.height );
    input.attr('data-placeholder-width', bounding.width);
    input.attr('data-placeholder-height', bounding.height);
  };

  self.autosizeTextbox = function(domTextInput) {
    var jqTextInput = $(domTextInput);
    var jqTextContainer = jqTextInput.parent();
    var jqTextBox = jqTextContainer.parent(); 
    var jqTextBackground = jqTextBox.find('.annotation-text-background').first();
    var jqTextHandle = jqTextBox.find('.annotation-text-handle').first();
    var size = parseInt(Session.get('overlay.size.font'));
    var width = parseInt(jqTextInput.css('width'));
    var height = parseInt(jqTextInput.css('height')); 
    if( jqTextInput.text() ){
      jqTextHandle.attr('height', height);
      jqTextBackground.attr('width', width);
      jqTextBackground.attr('height', height);
      jqTextContainer.attr('width', width + (2 * size) );
      jqTextContainer.attr('height', height);
    } else {
      jqTextHandle.attr('height', jqTextInput.attr('data-placeholder-height') );
      jqTextBackground.attr('width', jqTextInput.attr('data-placeholder-width') );
      jqTextBackground.attr('height', jqTextInput.attr('data-placeholder-height') );
      jqTextContainer.attr('width', jqTextInput.attr('data-placeholder-width') + (2 * size) );
      jqTextContainer.attr('height', jqTextInput.attr('data-placeholder-height') );
    }
  }

  self.cancelText = function(){
    // the textbox group
    $('.annotation-text.annotation-text-active').first().parent().parent().remove(); 
  }
  self.removeActiveText = function(){
    overlay.selectAll('.annotation-text-active')
        .classed('annotation-text-active', false);
  }
  self.setActiveText = function(domTextbox){
    self.removeActiveText();
    d3.select(domTextbox).classed('annotation-text-active', true);
  }

  var dragGroup = d3.behavior.drag()
    .origin(function() { 
      var d3Textbox = d3.select(this);
      return {
        x: d3Textbox.attr('x') + d3.transform(d3Textbox.attr('transform')).translate[0],
        y: d3Textbox.attr('y') + d3.transform(d3Textbox.attr('transform')).translate[1],
      };
    })
    .on('drag', function() {
      var d3Textbox = d3.select(this);
      var x = d3.event.x;
      var y = d3.event.y;
      d3Textbox.attr({
        'transform': function(){
            return 'translate(' + [ x, y ] + ')'
        },
        'data-x': _.round(parseInt(d3Textbox.attr('data-x-origin')) 
                          + parseFloat(d3.transform(d3Textbox.attr('transform')).translate[0])),
        'data-y': _.round(parseInt(d3Textbox.attr('data-y-origin')) 
                          + parseFloat(d3.transform(d3Textbox.attr('transform')).translate[1])),
      })
    });

  self.startDragTextbox = function(domTextBox){
    d3.select(domTextBox).call(dragGroup);
  }

  self.stopDragTextbox = function(textbox){
    d3.select(textbox).on('drag', null);
    d3.select(textbox).on('.drag', null);
  }

  self.storeActiveTextInputs = function( title, page ){
    var activeTextInput = $('.annotation-text-active');
    if ( activeTextInput.length ){
      // console.log('active text inputs:')
      // console.log(activeTextInput);
      // console.log('deactivating and storing all active texts:')
      self.removeActiveText();
      activeTextInput.each( function(){
        var domTextInput = this;
        self.storeTextbox( title, page, domTextInput);
      });
    }
  }

  function drawText(note) {
    var textbox = overlay.append('g')
      .attr({
        id: note._id,
        class: 'annotation annotation-text-box',
        'data-x': note.x,
        'data-y': note.y,
        'data-x-origin': note.x,
        'data-y-origin': note.y,
      });
    var handle = textbox.append('rect')
      .attr({
        class: 'annotation-text-handle',
        height: note.height,
        width: '20px',
        x: parseInt(note.x) - 20 + 'px',
        y: note.y,
      });
    var background = textbox.append('rect')
      .attr({
        class: 'annotation-text-background',
        height: note.height,
        width: note.width,
        x: note.x,
        y: note.y,
      });
    var text = textbox.append('foreignObject')
      .attr({
        class: 'annotation-text-container',
        height: '600px',
        width: '600px',
        x: note.x,
        y: note.y,
      });
      var input = text.append('xhtml:span')
        .attr({
          class: 'annotation-text annotation-text-input',
          'data-placeholder': 'Press enter when done\nShift+enter for new line.',
          contenteditable: '',
          wrap: 'hard',
        })        
        .style({
          color: note.color,
          'font-size': note.size + 'px',
          height: parseInt(note.height),
          width: parseInt(note.width) + note.size,
          'max-width': '600px',
          'min-width': (note.size * 5) + 'px',
          'min-height': note.size + 'px', 
        })   
        .text(note.text);
    self.autosizeTextbox(input.node());
  };
}