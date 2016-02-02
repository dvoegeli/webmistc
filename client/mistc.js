if (Meteor.isClient) {

  // libraries
  var overlayLibrary;
  var slideLibrary;

  // Startup
  Meteor.startup( function() {
    _ = lodash;
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

    // questions
    Meteor.subscribe('questions');

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

  });

  // Accounts
  Accounts.ui.config({
    passwordSignupFields: 'USERNAME_ONLY'
  });

  // Slide Navigation
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
      changeTool(tool);
    },
    'click .overlay-btn-color': function (event) {
      var color = $(event.currentTarget).attr('data-color');
      Session.set('overlay.color', color);
    },
    'click .overlay-btn-size': function (event) {
      var size = $(event.currentTarget).attr('data-size');
      Session.set('overlay.size.outline', size);
    },
    'click .overlay-btn-text': function (event) {
      var text = $(event.currentTarget).attr('data-size');
      Session.set('overlay.size.font', text);
    },
    'click .overlay-btn-sticky-replace > .toggle': function (event) {
      var stickyMode = $(event.currentTarget).hasClass('off');
      var replaceMode = !stickyMode;
      Session.set('overlay.tool.replace', replaceMode);
    }
  });

  Template.toolPanel.helpers({
    hasSelectedTextTool: function() {
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

  // Questions

  Template.questionPanel.helpers({
    questions: function() {
      return Questions.find({}, { sort: { time: 1} } );
    }
  });

  // Chat

  Template.chatPanel.helpers({
    messages: function() {
      return Messages.find({}, { sort: { time: 1}});
    }
  });

  Template.chatInput.events({
    'keydown textarea#chat-input-message' : function (event) {
      if(! Meteor.userId()){
        throw new Meteor.Error('not-authorized');
      }
      var $input = $(event.target);
      var enterKey = 13; // 13 is the enter key event
      if (event.which === enterKey) { 
        if (Meteor.user()){
          var name = Meteor.user().username;
        } else { 
          var name = 'Anonymous';
        }
        if ($input.val() != '') {
          var timestamp = Date.now().toString();
          Messages.insert({
            name: name,
            message: $input.val(),
            time: timestamp
          });
          $input.val('');
        }
        var $messages = $('#chat-panel');
        $messages.scrollTop($messages[0].scrollHeight);
      }
    }
  });

  Template.chatPanel.events({
    // very ugly parent nesting, needs some TLC
    'click .glyphicon-star' : function (event) {
      var $target = $(event.currentTarget);
      var name = $target.parent().parent().attr('data-name');
      var message = $target.parent().text().trim();
      var timestamp = $target.parent().parent().attr('data-time');
      Meteor.call('moveToQuestionPanel', name, message, timestamp);
    }
  });

  Template.questionPanel.events({
    // very ugly parent nesting, needs some TLC
    'click .glyphicon-remove' : function (event) {
      var $target = $(event.currentTarget);
      var timestamp = $target.parent().parent().attr('data-time');
      var question = Questions.find({time: timestamp}).fetch()[0];
      Meteor.call('moveToChatPanel', question.name, question.message, question.time);
    }
  });

  // Overlay
  function changeTool(_tool) {
    var tool = _tool;
    var cursor = $('[data-tool="' + tool + '"]').attr('data-cursor');
    Session.set('overlay.tool', tool);
    Session.set('overlay.cursor', cursor);
    changeCursor();
  }

  function changeCursor() {
    var cursor = Session.get('overlay.cursor');
    var tool = Session.get('overlay.tool');
    var color = _.isEqual( tool, 'erase' ) ? 'LightCoral' : Session.get('overlay.color');
    var rotation = ( _.isEqual( tool, 'line' ) || _.isEqual( tool, 'arrow' ) ) ? -45 : 0;
    $('#overlay').awesomeCursor(cursor, {
      color: color,
      rotate: rotation
    });
  }

  Template.overlay.onCreated( function () {
    // press CONTROL+Z to remove latest annotation from current slide
    key('control+z', 'keyboard-shortcuts', function() {
      overlayLibrary.undo(slideLibrary.title(), slideLibrary.getPage());
    });

    // press 1-7 to change tools
    key('1', 'keyboard-shortcuts', function() {
      changeTool('text');
    });
    key('2', 'keyboard-shortcuts', function() {
      changeTool('pencil');
    });
    key('3', 'keyboard-shortcuts', function() {
      changeTool('line');
    });
    key('4', 'keyboard-shortcuts', function() {
      changeTool('arrow');
    });
    key('5', 'keyboard-shortcuts', function() {
      changeTool('ellipse');
    });
    key('6', 'keyboard-shortcuts', function() {
      changeTool('rect');
    });
    key('7', 'keyboard-shortcuts', function() {
      changeTool('erase');
    });

    // press - and = to cycle through colors
    key('-', 'keyboard-shortcuts', function() {
      var color = overlayLibrary.cycleLeftToolColor();
      Session.set('overlay.color', color);
      changeCursor();
    });
    key('=', 'keyboard-shortcuts', function() {
      var color = overlayLibrary.cycleRightToolColor();
      Session.set('overlay.color', color);
      changeCursor();
    });

    // press _ and + to cycle through sizes
    key('shift+-', 'keyboard-shortcuts', function() {
      var hasSelectedTextTool = _.isEqual( Session.get('overlay.tool'), 'text' );
      if(hasSelectedTextTool){
        var fontSize = overlayLibrary.cycleLeftTextSize();
        Session.set('overlay.size.font', fontSize);
      } else {
        var outlineSize = overlayLibrary.cycleLeftToolSize();
        Session.set('overlay.size.outline', outlineSize);
      }
    });
    key('shift+=', 'keyboard-shortcuts', function() {
      var hasSelectedTextTool = _.isEqual( Session.get('overlay.tool'), 'text' );
      if(hasSelectedTextTool){
        var fontSize = overlayLibrary.cycleRightTextSize();
        Session.set('overlay.size.font', fontSize);
      } else {
        var outlineSize = overlayLibrary.cycleRightToolSize();
        Session.set('overlay.size.outline', outlineSize);
      }
    });

    // press ENTER to store new textbox
    key('enter', 'text-entry', function(){
      var jqTextInput = $('.annotation-text-input.annotation-text-active').first();
      // console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')
      // console.log('text input is: ')
      // console.log(jqTextInput)
      var isReplaceOn = Session.get('overlay.tool.replace');
      overlayLibrary.removeActiveText();
      key.filter = key.filters['all'];
      key.setScope('keyboard-shortcuts');
      // console.log('^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^')
      // console.log('pressed enter!')
      // console.log('text entry is off. scope is: ' + key.getScope())
      overlayLibrary.storeTextbox(slideLibrary.title(), slideLibrary.getPage(), jqTextInput.get(0));
      if( isReplaceOn ){
        overlayLibrary.replaceNote('previous', slideLibrary.title(), slideLibrary.getPage());
      }
    });
    // press ESCAPE to cancel text entry
    key('escape', 'text-entry', function() {
      key.filter = key.filters['all'];
      key.setScope('keyboard-shortcuts');
      overlayLibrary.cancelText();
    });

    key.setScope('keyboard-shortcuts');
  });  

  key.filters = {
    'all': function filter(event){
      var tagName = (event.target || event.srcElement).tagName;
      // ignore keypressed in any elements that support keyboard data input
      return !(tagName == 'INPUT' || tagName == 'SELECT' || tagName == 'TEXTAREA');
    },
    'keyboard-shortcuts': function filter(event){
      var tagName = (event.target || event.srcElement).tagName;
      // ignore keypressed in any elements that support keyboard data input
      return !(tagName == 'INPUT' || tagName == 'SELECT' || tagName == 'TEXTAREA');
    },
    'text-entry': function filter(event){
      var tagName = (event.target || event.srcElement).tagName;
      return (tagName === 'SPAN');
    }
  }

  Template.overlay.onRendered(function(){

  })

  Template.overlay.events({
    'click': function (event) {
      var hasClickedLeftMouseButton = _.isEqual(event.which, 1);
      if ( !hasClickedLeftMouseButton ) { return true; }
      //-------------------------------------------------------
      var d3Target = d3.select(event.currentTarget);
      var hasSelectedTextTool = _.isEqual( Session.get('overlay.tool'), 'text' );
      var isReplaceOn = Session.get('overlay.tool.replace');
      var isTargetTextInput =  d3Target.classed('annotation-text-input');
      var isTargetTextHandle =  d3Target.classed('annotation-text-handle');
      // console.log('target:')
      // console.log(d3Target.node())
      // console.log('replace on: ' + isReplaceOn)
      // console.log('is the target .annotation-text-input: ' + isTargetTextInput)
      // console.log('text tool active: ' + hasSelectedTextTool)
      // console.log('is the target .annotation-text-handle: ' + isTargetTextHandle)
      if ( isReplaceOn ) {
        if ( isTargetTextInput ) {
          overlayLibrary.setActiveText(d3Target.node());
          key.setScope('text-entry'); 
          key.filter = key.filters['text-entry'];
          // console.log('text entry is on. scope is: ' + key.getScope())
        } else { // nothing, shape, or handle is here
          if ( !isTargetTextHandle ) {  
            if( hasSelectedTextTool ) {
              overlayLibrary.placeText(slideLibrary.title(), slideLibrary.getPage());
              key.setScope('text-entry'); 
              key.filter = key.filters['text-entry'];
              // console.log('text entry is on: ' + key.getScope())
            } else {
              overlayLibrary.replaceNote('latest', slideLibrary.title(), slideLibrary.getPage());
            }
          } else if( isTargetTextHandle ){
            var domTextBox = d3Target.node().parentNode;
            overlayLibrary.startDragTextbox(domTextBox);
          }
        } // start drawing a shape
      } else { // replace is turned off
        if ( isTargetTextInput ) {
          overlayLibrary.setActiveText(d3Target.node());
          key.setScope('text-entry'); 
          key.filter = key.filters['text-entry'];
          // console.log('text entry is on. scope is:' + key.getScope())
        } else { // nothing, shape, or handle is here
          if ( hasSelectedTextTool ) {  
            if( !isTargetTextHandle ){
              overlayLibrary.removeActiveText();
              overlayLibrary.placeText(slideLibrary.title(), slideLibrary.getPage());
              key.setScope('text-entry'); 
              key.filter = key.filters['text-entry'];
              // console.log('text entry is on. scope is:' + key.getScope())
            } else if( isTargetTextHandle ){
              var domTextBox = d3Target.node().parentNode;
              overlayLibrary.startDragTextbox(domTextBox); 
            }
          } // start drawing a shape
        }
      }
    },
    'mouseup': function (event) {
      var hasClickedLeftMouseButton = _.isEqual(event.which, 1);
      if ( !hasClickedLeftMouseButton ) { return true; }
      //-------------------------------------------------------
      var d3Target = d3.select(event.target);
      var hasSelectedTextTool = _.isEqual( Session.get('overlay.tool'), 'text' );
      var isTargetTextInput =  d3Target.classed('annotation-text-input');
      var isTargetTextHandle =  d3Target.classed('annotation-text-handle');
      if( (!hasSelectedTextTool && !isTargetTextInput && !isTargetTextHandle) ) {
        Session.set('draw', false);
        switch( Session.get('overlay.tool') ) {
          case 'line':
            overlayLibrary.markLineEnd(event);
            overlayLibrary.markLine(slideLibrary.title(), slideLibrary.getPage(), event);
            break;
          case 'arrow':
            overlayLibrary.markArrowEnd(event);
            overlayLibrary.markArrow(slideLibrary.title(), slideLibrary.getPage(), event);
            break;
          case 'rect':
            overlayLibrary.markBoxCorner(event);
            overlayLibrary.recoordinateBox(event);
            overlayLibrary.markBox(slideLibrary.title(), slideLibrary.getPage(), event);
            break;
          case 'ellipse':
            overlayLibrary.markEllipseCorner(event);
            overlayLibrary.recoordinateEllipse(event);
            overlayLibrary.markEllipse(slideLibrary.title(), slideLibrary.getPage(), event);
            break;
          case 'pencil':
            overlayLibrary.markSquiggle(slideLibrary.title(), slideLibrary.getPage(), event);
            break;
          case 'erase':
            overlayLibrary.deactivateEraser();
            break;
        }       
      }
      // console.log('--------------------------------------------------------------------')
    },
    'mouseover .annotation-text-handle': function(event){
      var jqTextbox = $(event.target).parent().get(0);
      overlayLibrary.startDragTextbox(jqTextbox);
    },
    'mouseout .annotation-text-handle': function(event){
      var jqTextbox = $(event.target).parent().get(0);
      overlayLibrary.stopDragTextbox(jqTextbox);
    },
    'mouseup .annotation-text-handle': function(event){
      var jqTextHandle = $(event.target);
      var jqTextBox = jqTextHandle.parent();
      var jqTextInput = jqTextBox.find('.annotation-text-input').first();
      overlayLibrary.storeTextbox(slideLibrary.title(), slideLibrary.getPage(), jqTextInput.get(0));
    },
    'keyup .annotation-text-input, mouseup .annotation-text-input': function(event){
      var domTextInput = event.target;
      overlayLibrary.autosizeTextbox(domTextInput);
    },
    'mouseover': function(event){
      changeCursor();
    },
    'mouseexit': function(event){
      $('#overlay').css('cursor', '');
    },
    'click .annotation': function(event){
      if (_.isEqual( Session.get('overlay.tool'), 'erase' ) ){
        overlayLibrary.useEraserOnce(event, slideLibrary.title(), slideLibrary.getPage());
      }
    },
    'mousedown': function (event) {
      var hasClickedLeftMouseButton = _.isEqual(event.which, 1);
      if ( !hasClickedLeftMouseButton ) { return true; }
      //-------------------------------------------------------
      var d3Target = d3.select(event.target);
      var isReplaceOn = Session.get('overlay.tool.replace');
      var hasSelectedTextTool = _.isEqual( Session.get('overlay.tool'), 'text' );
      var isTargetTextInput =  d3Target.classed('annotation-text-input');
      var isTargetTextHandle =  d3Target.classed('annotation-text-handle');
      overlayLibrary.storeActiveTextInputs(slideLibrary.title(), slideLibrary.getPage());
      key.filter = key.filters['all'];
      key.setScope('keyboard-shortcuts');
      if(isReplaceOn){
        overlayLibrary.replaceNote('previous', slideLibrary.title(), slideLibrary.getPage());
      }
      if( (!isTargetTextInput && !isTargetTextHandle && !hasSelectedTextTool) ) {
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