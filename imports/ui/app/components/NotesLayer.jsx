import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import _ from 'lodash';

import AppState from '/imports/api/appState';
import {
  default as Layer } from '/imports/api/notesLayer';
import { Notes } from '/imports/api/notes';

// Notes Layer component - represents the notes layer on the whiteboard
class NotesLayer extends Component {
  constructor(props) {
    super(props);
    this.takeNote = _.throttle(Layer.takeNote, 40);
    this.layer;
    this.coords = { /*x: Number, y: Number*/ };
  }
  componentDidMount(){
    //console.log(this.layer)
    this.coords = this.layer.createSVGPoint();
  }
  generateCoords(event){
    // x: (event.nativeEvent.clientX || event.nativeEvent.touches[0].clientX),
    // y: (event.nativeEvent.clientX || event.nativeEvent.touches[0].clientY),
    this.coords.x = event.clientX || (event.nativeEvent.touches[0] && event.nativeEvent.touches[0].clientX) || this.coords.x;
    this.coords.y = event.clientY || (event.nativeEvent.touches[0] && event.nativeEvent.touches[0].clientY) || this.coords.y;
    const coords = this.coords.matrixTransform(this.layer.getScreenCTM().inverse());
    const cursorOffset = 10;
    coords.x = Math.round(coords.x) + 8;
    coords.y = Math.round(coords.y) + 25;
    return coords;
  }
  handleStartTaking(event) {
    const { note_erasing } = this.props;
    if (note_erasing) {
      AppState.set('note_erasing', true);
      return;
    };
    Layer.startTaking(this.generateCoords(event));
  }
  handleTaking(event) {
    //console.log(this.generateCoords(event))
    const { note_displaying, note_type, note_erasing } = this.props;
    if (note_erasing) return;
    // _.throttle needs event.persist() 
    event.persist();
    if (note_displaying) {
      this.takeNote(this.generateCoords(event));
    }
  }
  handleStopTaking(event) {
    const { note_erasing } = this.props;
    if (note_erasing) {
      AppState.set('note_erasing', false);
      return;
    };
    Layer.stopTaking(this.generateCoords(event));
  }
  render() {
    const { notes, note_displaying, note_data } = this.props;
    const { slide_height, slide_width } = this.props;
    const notePreview = Layer.fetchNoteData();
    const style = {
      margin: 0,
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: slide_width, 
      height: slide_height,
      filter: 'drop-shadow(  1px 1px 2px rgba(0,0,0,0.35) )',
    };
    return (
      <svg style={style} 
        onMouseDown={(event)=>this.handleStartTaking(event)}
        onMouseMove={(event)=>this.handleTaking(event)}
        onMouseUp={(event)=>this.handleStopTaking(event)}
        onTouchStart={(event)=>this.handleStartTaking(event)}
        onTouchMove={(event)=>this.handleTaking(event)}
        onTouchEnd={(event)=>this.handleStopTaking(event)}
        preserveAspectRatio='xMidYMin meet'
        viewBox='0 0 1026 635'
        ref={(layer) => { this.layer = layer; }}
      >
        {notes.map((note)=>Layer.fetchNote(note))}
        {note_displaying ? Layer.fetchNote(notePreview) : ''}
      </svg>
    );
  }
}

NotesLayer.propTypes = {
  note_displaying: PropTypes.bool.isRequired,
  notes_sticky: PropTypes.bool.isRequired,
  note_sticky_next: PropTypes.string.isRequired,
  note_type: PropTypes.string.isRequired,
  note_color: PropTypes.string.isRequired,
  note_size: PropTypes.string.isRequired,
  note_data: PropTypes.oneOfType([
    React.PropTypes.object,
    React.PropTypes.array,
  ]),
  slide_height: PropTypes.number,
  slide_width: PropTypes.number,
};

export default createContainer(() => {
  Meteor.subscribe('notes');
  Meteor.subscribe('stickyNotes');
  return {
    notes: Notes.getNotes(),
    notes_sticky: AppState.get('notes_sticky'),
    note_erasing: _.isEqual(AppState.get('note_type'), 'eraser'),
    note_sticky_next: AppState.get('note_sticky_next'),
    note_displaying: AppState.get('note_displaying'),
    note_type: AppState.get('note_type'),
    note_color: AppState.get('note_color'),
    note_size: AppState.get('note_size'),
    note_data: AppState.get('note_data'),
    slide_height: AppState.get('slide_height'),
    slide_width: AppState.get('slide_width'),
  };
}, NotesLayer);
