import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import classNames from 'classnames';
import _ from 'lodash';
 
import AppState from '/imports/api/appState.js';
import { Notes } from '/imports/api/notes.js';
import { Lines } from '/imports/api/lines.js';
import { Slides } from '/imports/api/slides.js';

import Line from './notes/Line.jsx';


// Notes component - represents the notes layer on the whiteboard
class NotesLayer extends Component {
  constructor(props) {
    super(props);
    this.notes = { 
      /*draw:   (note) => <Draw note={note}/>,
      text:     (note) => <Text note={note}/>,*/
      line:     (note) => <Line {...note} key={note._id}/>,
      /*arrow:  (note) => <Arrow note={note}/>
      circle:   (note) => <Circle note={note}/>,
      box:      (note) => <Box note={note}/>,*/
    };
    this.takeNote = _.throttle(this.takeNote.bind(this), 40);
    this.cursorOffset = 10;
  }
  fetch(note){
    return this.notes[note.type](note);
  }
  startTaking(event){
    const x1 = event.nativeEvent.offsetX + this.cursorOffset;
    const y1 = event.nativeEvent.offsetY + this.cursorOffset;
    AppState.set('note_displaying', true);
    AppState.set('note_x1', x1);
    AppState.set('note_y1', y1);
    AppState.set('note_x2', x1);
    AppState.set('note_y2', y1);
  }
  takeNote(event){
    const {isNoteDisplaying} = this.props;
    if(isNoteDisplaying){
      const x2 = event.nativeEvent.offsetX + this.cursorOffset;
      const y2 = event.nativeEvent.offsetY + this.cursorOffset;
      AppState.set('note_x2', x2);
      AppState.set('note_y2', y2);
    }
  }
  handleTaking(event){
    event.persist();
    this.takeNote(event);
  }

  stopTaking(event){
    AppState.set('note_displaying', false);
    Meteor.call('lines.insert', {
      x1: AppState.get('note_x1'), 
      y1: AppState.get('note_y1'),
      x2: AppState.get('note_x2'), 
      y2: AppState.get('note_y2'),
    });
  }

  render() {
    const {isNoteDisplaying, style} = this.props;
    const {note_x1, note_y1, note_x2, note_y2} = this.props;
    const notePreview = {
      type: 'line',
      x1: note_x1, 
      y1: note_y1,
      x2: note_x2, 
      y2: note_y2,
      color: 'black',
      size: 2,
    };
    return (
      <svg style={style} 
        onMouseDown={(event)=>this.startTaking(event)}
        onMouseMove={(event)=>this.handleTaking(event)}
        onMouseUp={(event)=>this.stopTaking(event)}
      >
        {this.props.notes.map((note)=>this.fetch(note))}
        {isNoteDisplaying ? this.fetch(notePreview) : ''}
      </svg>
    );
  }
}

NotesLayer.propTypes = {
  isNoteDisplaying: PropTypes.bool.isRequired,
  note_x1: PropTypes.number.isRequired,
  note_y1: PropTypes.number.isRequired,
  note_x2: PropTypes.number.isRequired,
  note_y2: PropTypes.number.isRequired,
};
 
export default createContainer(() => {
  Meteor.subscribe('notes');
  const activeSlide = Slides.findOne({active: true}) && Slides.findOne({active: true})._id;
  return {
    notes: Notes.find({slide: activeSlide}, { sort: { createdAt: -1 } }).fetch() || [],
    isNoteDisplaying: AppState.get('note_displaying'),
    note_x1: AppState.get('note_x1'),
    note_y1: AppState.get('note_y1'),
    note_x2: AppState.get('note_x2'),
    note_y2: AppState.get('note_y2'),
  };
}, NotesLayer);  