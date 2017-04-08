import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import _ from 'lodash';

import AppState from '/imports/api/appState';
import { default as Layer } from '/imports/api/notesLayer';
import { Notes } from '/imports/api/notes';


// Notes Layer component - represents the notes layer on the whiteboard
class NotesLayer extends Component {
  constructor(props) {
    super(props);
    this.takeNote = _.throttle(Layer.takeNote, 40);
  }
  handleStartTaking(event) {
    Layer.startTaking(event);
  }
  handleTaking(event) {
    const isNoteDisplaying = AppState.get('note_displaying');
    // _.throttle needs event.persist() 
    event.persist();
    if (isNoteDisplaying) {
      this.takeNote(event);
    }
  }
  handleStopTaking(event) {
    Layer.stopTaking(event);
  }
  render() {
    const { notes, note_displaying, note_data, style } = this.props;
    const notePreview = Layer.fetchNoteData();
    return (
      <svg style={style} 
        onMouseDown={(event)=>this.handleStartTaking(event)}
        onMouseMove={(event)=>this.handleTaking(event)}
        onMouseUp={(event)=>this.handleStopTaking(event)}
        onTouchStart={(event)=>this.handleStartTaking(event)}
        onTouchMove={(event)=>this.handleTaking(event)}
        onTouchEnd={(event)=>this.handleStopTaking(event)}
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
};

export default createContainer(() => {
  Meteor.subscribe('notes');
  Meteor.subscribe('stickyNotes');
  return {
    notes: Notes.getNotes(),
    notes_sticky: AppState.get('notes_sticky'),
    note_sticky_next: AppState.get('note_sticky_next'),
    note_displaying: AppState.get('note_displaying'),
    note_type: AppState.get('note_type'),
    note_color: AppState.get('note_color'),
    note_size: AppState.get('note_size'),
    note_data: AppState.get('note_data'),
  };
}, NotesLayer);
