if (Meteor.isClient) {

  // libraries
  var overlayLibrary;
  var slideLibrary;

  // Startup
  Meteor.startup( function() {
    slideLibrary = new SlideLibrary('WelcomeToMISTCweb');
    overlayLibrary = new OverlayLibrary();

    // slides
    Meteor.subscribe('slidesCollection', function(){
      var url = '/slides/' + slideLibrary.title() + '.pdf';
      PDFJS.getDocument(url).then(function (slide) {
        slideLibrary.set(slide);
        var slideDocument = SlidesCollection.find({ _id: slideLibrary.title() }).fetch()[0];
        if (!slideDocument){
          Session.set('slide.page', 'first');
          SlidesCollection.insert({ _id: slideLibrary.title(), page: slideLibrary.getPage('first') });  
        } else if(slideDocument.page) {
          Session.set('slide.page', slideDocument.page);   
        } 
        slideLibrary.render(slideLibrary.getPage(Session.get('slide.page')));      
      }); 
    });
    // presentations
    Meteor.subscribe('presentations', function(){
      var hasPresentations = Presentations.find({}).count() > 0
      if (!hasPresentations){
        Presentations.insert({_id: slideLibrary.title() + ( Session.get('slide.page') || slideLibrary.getPage('first') ), overlay: [] });
      }
    });
    // messages
    Meteor.subscribe('messages');

    Tracker.autorun( function() {
      // slides
      var slideDocument = SlidesCollection.find({ _id: slideLibrary.title() }).fetch()[0];
      if (slideDocument && slideLibrary){
        Session.set('slide.page', slideDocument.page); 
        slideLibrary.render(slideDocument.page); 
      } 
    });

    Tracker.autorun( function() {
      // overlay
      var data = Presentations.find( { _id: slideLibrary.title() + Session.get('slide.page') }).fetch()
      if(data.length){
        data = data[0].overlay;
      }
      if (overlayLibrary) {
        overlayLibrary.draw(data);
      }
    });

    // chat
    var $messages = $('#chat-panel');
    $messages.scrollTop($messages[0].scrollHeight);

  });

  // Accounts
  Accounts.ui.config({
    passwordSignupFields: 'USERNAME_ONLY'
  });

  Template.slideNavPanel.onRendered(function(){
    $('#slide-nav-gallery').slick({
      dots: true,
      arrows: true,
      infinite: false,
      slidesToShow: 5,
      slidesToScroll: 2
    });
  });

  Template.slideNavPanel.events({
    'click .slide-nav-option': function (event) {
      slideLibrary.setPage(event);
    }
  });

  // Tool Panel
  Template.toolPanel.events({
    'click #overlay-btn-tool-clear': function (event) {
      Meteor.call('clear', slideLibrary.title() , Session.get('slide.page'), function() {
        overlayLibrary.clear();
      });
    },
    'click .overlay-btn-tool': function (event) {
      var tool = $(event.currentTarget).attr('data-tool');
      var cursor = $(event.currentTarget).attr('data-cursor');
      Session.set('overlay.tool', tool);
      Session.set('overlay.cursor', cursor);
    },
    'click .overlay-btn-color': function (event) {
      var color = $(event.currentTarget).attr('data-color');
      Session.set('overlay.color', color);
    },
    'click .overlay-btn-size': function (event) {
      var size = $(event.currentTarget).attr('data-size');
      Session.set('overlay.size', size);
    },
    'click .overlay-btn-text': function (event) {
      var text = $(event.currentTarget).attr('data-text');
      Session.set('overlay.text', text);
    },
    'click .overlay-btn-sticky-replace > .toggle': function (event) {
      var stickyMode = $(event.currentTarget).hasClass('off');
      var replaceMode = !stickyMode;
      Session.set('overlay.tool.replace', replaceMode);
    }
  });

  Template.toolPanel.helpers({
    isTextToolActive: function() {
      return _.isEqual( Session.get('overlay.tool'), 'text' );
    }
  });

  // Control
  Template.controlPanel.onRendered(function () {
    $('.slider-selection').slider({
      formatter: function(value) {
        return 'Current value: ' + value;
      }
    });
  });

  // Chat
  Template.chatPanel.helpers({
    messages: function() {
      return Messages.find({}, { sort: { time: 1}});
    }
  });

  Template.chatInput.events = {
    'keydown textarea#chat-input-message' : function (event) {
      if(! Meteor.userId()){
        throw new Meteor.Error('not-authorized');
      }
      var $input = $(event.target);
      var enterKeyPress = 13; // 13 is the enter key event
      if (event.which == enterKeyPress) { 
        if (Meteor.user()){
          var name = Meteor.user().username;
        } else { 
          var name = 'Anonymous';
        }
        if ($input.val() != '') {
          Messages.insert({
            name: name,
            message: $input.val(),
            time: Date.now(),
          });
          $input.val('');
        }
      }
      var $messages = $('#chat-panel');
      $messages.scrollTop($messages[0].scrollHeight);
    }
  }

  // Document 
  // wish this was a global template :-(
  // TODO: make a "global" template that has everything placed inside
  // then test to "global" events from the "global" template
  // Template.document.events({
  $(document).on('keydown', function (event){
    var shiftKey  = 16;  // 16 is the shift key event 
    var ctrlKey   = 17;  // 17 is the control key event
    var keyPressed = event.which;
    // set the SHIFT modifier
    if( _.isEqual( keyPressed, shiftKey ) ){ 
      Session.set('overlay.keydown.shift', true); 
    };
    // set the CTRL modifier
    if( _.isEqual( keyPressed, ctrlKey ) ){ 
      Session.set('overlay.keydown.ctrl', true); 
    }; 

    // undo the last note by pressing CTRL+Z
    var zKey = 90;  // 90 is the 'z' key event
    var ctrlKeyDown = Session.get('overlay.keydown.ctrl');
    var zKeyDown = keyPressed == zKey;
    if ( ctrlKeyDown && zKeyDown )  { 
      // how to delete from database?
      overlayLibrary.undo(slideLibrary.title(), slideLibrary.getPage());
    } 
  });

  $(document).on('keyup', function (event){
    var shiftKey  = 16;  // 16 is the shift key event 
    var ctrlKey   = 17;  // 17 is the control key event
    var keyReleased = event.which;
    // unset the SHIFT modifier
    if( _.isEqual( keyReleased, shiftKey ) ){
      Session.set('overlay.keydown.shift', false);
    }
    // unset the CONTROL modifier
    if( _.isEqual( keyReleased, ctrlKey ) ){
      Session.set('overlay.keydown.ctrl', false);
    } 
  });

  
  Template.overlay.events({
    'keydown textarea#overlay-place-textarea': function(event){
      // ESC will cancel the text
      // ENTER will attach the text
      // SHIFT + ENTER will add a new line
      var enterKey  = 13;  // 13 is the enter key event
      var escapeKey = 27;  // 27 is the escape key event
      var shiftKey  = 16;  // 16 is the shift key event 
      var ctrlKey   = 17;  // 17 is the control key event
      var keyPressed = event.which;
      // attach the text
      var shiftKeyDown = Session.get('overlay.keydown.shift');
      var enterKeyPressed = (keyPressed == enterKey);
      if ( enterKeyPressed && !shiftKeyDown ) { 
        overlayLibrary.attachText(slideLibrary.title(), slideLibrary.getPage());
      } 
      //cancel the text
      var escapeKeyPressed = (keyPressed == escapeKey);
      if ( escapeKeyPressed ){
        overlayLibrary.cancelText();
      }  
      // trigger replace if in replace mode
      if( _.isEqual( keyPressed, enterKey ) && _.isEqual(Session.get('overlay.tool.replace'), true) ){
        overlayLibrary.replace(slideLibrary.title(), slideLibrary.getPage());
      }    
    },
    'keyup textarea': function(event){
      overlayLibrary.autoresizeTextInput(event);
    },
    'keydown': function(event){
      var shiftKey  = 16;  // 16 is the shift key event 
      var ctrlKey   = 17;  // 17 is the control key event
      var keyPressed = event.which;
      // set the SHIFT modifier
      if( _.isEqual( keyPressed, shiftKey ) ){ 
        Session.set('overlay.keydown.shift', true); 
      };
      // set the CTRL modifier
      if( _.isEqual( keyPressed, ctrlKey ) ){ 
        Session.set('overlay.keydown.ctrl', true); 
      }; 

      // undo the last note by pressing CTRL+Z
      var zKey = 90;  // 90 is the 'z' key event
      var ctrlKeyDown = Session.get('overlay.keydown.ctrl');
      var zKeyDown = keyPressed == zKey;
      if ( ctrlKeyDown && zKeyDown )  { 
        overlayLibrary.undo(slideLibrary.title(), slideLibrary.getPage());
      }     
    },
    'keyup': function(event){
      var shiftKey = 16;  // 16 is the shift key event 
      var ctrlKey  = 17;  // 17 is the control key event
      var keyReleased = event.which;
      // unset the SHIFT modifier
      if( _.isEqual( keyReleased, shiftKey ) ){
        Session.set('overlay.keydown.shift', false);
      }
      // unset the CONTROL modifier
      if( _.isEqual( keyReleased, ctrlKey ) ){
        Session.set('overlay.keydown.ctrl', false);
      }
    },
    'mouseover': function(event){
      var cursor = Session.get('overlay.cursor');
      var tool = Session.get('overlay.tool');
      var color = _.isEqual( tool, 'erase' ) ? 'LightCoral' : Session.get('overlay.color');
      var rotation = ( _.isEqual( tool, 'line' ) || _.isEqual( tool, 'arrow' ) ) ? -45 : 0;
      $('#overlay').awesomeCursor(cursor, {
        color: color,
        rotate: rotation
      });
    },
    'mouseout': function(event){
      $('#overlay').css('cursor', '');
    },
    'click': function(event){
      var target = $(event.target);
      if (_.isEqual( Session.get('overlay.tool'), 'text' ) && !_.isEqual(target.attr('id'), 'overlay-place-textarea') && !target.hasClass('annotation-text') ){
        // CLICK outside the textarea will cancel the text
        // CLICK inside the textarea will move the input cursor
        overlayLibrary.placeText(slideLibrary.title(), slideLibrary.getPage(), event);       
      }
    },

    'click .annotation': function(event){
      if (_.isEqual( Session.get('overlay.tool'), 'erase' ) ){
        overlayLibrary.useEraserOnce(event, slideLibrary.title(), slideLibrary.getPage());
      }
    },
    'mousedown': function (event) {
      Session.set('draw', true);
      if (_.isEqual( Session.get('overlay.tool'), 'line' ) ){
        overlayLibrary.markLineStart(event);
      }
      if (_.isEqual( Session.get('overlay.tool'), 'arrow' ) ){
        overlayLibrary.markArrowStart(event);
      }
      if (_.isEqual( Session.get('overlay.tool'), 'rect' ) ){
        overlayLibrary.markBoxOrigin(event);
      }    
      if (_.isEqual( Session.get('overlay.tool'), 'ellipse' ) ){
        overlayLibrary.markEllipseOrigin(event);
      }  
      if (_.isEqual( Session.get('overlay.tool'), 'pencil' ) ){
        overlayLibrary.markSquiggleStart(event);
      } 
      if (_.isEqual( Session.get('overlay.tool'), 'erase' ) ){
        overlayLibrary.activateEraser(slideLibrary.title(), slideLibrary.getPage());
      }    
    },
    'mouseup': function (event) {
      Session.set('draw', false);
      if (Session.get('overlay.tool.replace') && !_.isEqual(Session.get('overlay.tool'), 'text') ){
        overlayLibrary.replace(slideLibrary.title(), slideLibrary.getPage());
      }
      if (_.isEqual( Session.get('overlay.tool'), 'line' ) ){
        overlayLibrary.markLineEnd(event);
        overlayLibrary.markLine(slideLibrary.title(), slideLibrary.getPage(), event);
      }
      if (_.isEqual( Session.get('overlay.tool'), 'arrow' ) ){
        overlayLibrary.markArrowEnd(event);
        overlayLibrary.markArrow(slideLibrary.title(), slideLibrary.getPage(), event);
      }
      if (_.isEqual( Session.get('overlay.tool'), 'rect' ) ){
        overlayLibrary.markBoxCorner(event);
        overlayLibrary.recoordinateBox(event);
        overlayLibrary.markBox(slideLibrary.title(), slideLibrary.getPage(), event);
      }
      if (_.isEqual( Session.get('overlay.tool'), 'ellipse' ) ){
        overlayLibrary.markEllipseCorner(event);
        overlayLibrary.recoordinateEllipse(event);
        overlayLibrary.markEllipse(slideLibrary.title(), slideLibrary.getPage(), event);
      }  
      if (_.isEqual( Session.get('overlay.tool'), 'pencil' ) ){
        overlayLibrary.markSquiggle(slideLibrary.title(), slideLibrary.getPage(), event);
      } 
      if (_.isEqual( Session.get('overlay.tool'), 'erase' ) ){
        overlayLibrary.deactivateEraser();
      }          
    },
    'mousemove': function (event) {
      overlayLibrary.createLocalSpace(event);
      if (Session.get('draw')) { 
        if (_.isEqual( Session.get('overlay.tool'), 'line' ) ){
          overlayLibrary.markLineEnd(event);
          overlayLibrary.placeLine(event);
        } 
        if (_.isEqual( Session.get('overlay.tool'), 'arrow' ) ){
          overlayLibrary.markArrowEnd(event);
          overlayLibrary.placeArrow(event);
        } 
        if (_.isEqual( Session.get('overlay.tool'), 'rect' ) ){
          overlayLibrary.markBoxCorner(event);
          overlayLibrary.recoordinateBox(event);
          overlayLibrary.placeBox(event); 
        }
        if (_.isEqual( Session.get('overlay.tool'), 'ellipse' ) ){
          overlayLibrary.markEllipseCorner(event);
          overlayLibrary.recoordinateEllipse(event);
          overlayLibrary.placeEllipse(event); 
        } 
        if (_.isEqual( Session.get('overlay.tool'), 'pencil' ) ){
          overlayLibrary.placeSquiggle(event); 
        }        
      }
    }
  });
} 