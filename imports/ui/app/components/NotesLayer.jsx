import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import classNames from 'classnames';
import _ from 'lodash';
 
import AppState from '/imports/api/appState';
import Colors from '/imports/api/colors';
import Sizes from '/imports/api/sizes';
import { Notes } from '/imports/api/notes';
import { Lines } from '/imports/api/lines';
import { Slides } from '/imports/api/slides';

import Line from './notes/Line.jsx';
import Arrow from './notes/Arrow.jsx';
import Box from './notes/Box.jsx';
import Circle from './notes/Circle.jsx';


// Notes component - represents the notes layer on the whiteboard
class NotesLayer extends Component {
  constructor(props) {
    super(props);
    this.notes = { 
      /*draw: (note) => <Draw {...note} key={note._id}/>,*/
      /*text: (note) => <Text {...note} key={note._id}/>,*/
      line:   (note) => <Line {...note} key={note._id}/>,
      arrow:  (note) => <Arrow {...note} key={note._id}/>,
      circle: (note) => <Circle {...note} key={note._id}/>,
      box:    (note) => <Box {...note} key={note._id}/>,
    };
    this.takeNote = _.throttle(this.takeNote.bind(this), 40);
    this.cursorOffset = 10;
  }
  fetch(note){
    return this.notes[note.type](note);
  }
  generateCoords(event){
    let coords = {
      x: (event.nativeEvent.offsetX || event.nativeEvent.touches[0].clientX ),
      y: (event.nativeEvent.offsetY || event.nativeEvent.touches[0].clientY ),
    }
    return _.forEach(coords, (value, coord, coords) => { 
      coords[coord] = value + this.cursorOffset;
    });
  }
  startTaking(event){
    const coords = this.generateCoords(event);
    AppState.set({
      'note_displaying': true,
      'note_x1': coords.x,
      'note_y1': coords.y,
      'note_x2': coords.x,
      'note_y2': coords.y,
    });
  }
  handleTaking(event){
    event.persist();
    this.takeNote(event);
  }
  takeNote(event){
    const {isNoteDisplaying} = this.props;
    if(isNoteDisplaying){
      const coords = this.generateCoords(event);
      AppState.set('note_x2', coords.x);
      AppState.set('note_y2', coords.y);
    }
  }
  stopTaking(event){
    AppState.set('note_displaying', false);
    const {note_type, note_color, note_size} = this.props;
    const {note_x1, note_y1, note_x2, note_y2} = this.props;
    Meteor.call(`${note_type}.insert`, {
      x1: note_x1, 
      y1: note_y1,
      x2: note_x2, 
      y2: note_y2,
      color: Colors.getHex(note_color),
      size: Sizes.getHex(note_size),
    });
  }

  render() {
    const {isNoteDisplaying, style} = this.props;
    const {note_type, note_color, note_size} = this.props;
    const {note_x1, note_y1, note_x2, note_y2} = this.props;
    const notePreview = {
      type: note_type,
      x1: note_x1, 
      y1: note_y1,
      x2: note_x2, 
      y2: note_y2,
      color: Colors.getHex(note_color),
      size: Sizes.getHex(note_size),
    };
    return (
      <svg style={style} 
        onMouseDown={(event)=>this.startTaking(event)}
        onMouseMove={(event)=>this.handleTaking(event)}
        onMouseUp={(event)=>this.stopTaking(event)}
        onTouchStart={(event)=>this.startTaking(event)}
        onTouchMove={(event)=>this.handleTaking(event)}
        onTouchEnd={(event)=>this.stopTaking(event)}
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
  note_type: PropTypes.string.isRequired,
  note_color: PropTypes.string.isRequired,
  note_size: PropTypes.string.isRequired,
};
 
export default createContainer(() => {
  Meteor.subscribe('notes');
  return {
    notes: Notes.getNotes(),
    isNoteDisplaying: AppState.get('note_displaying'),
    note_x1: AppState.get('note_x1'),
    note_y1: AppState.get('note_y1'),
    note_x2: AppState.get('note_x2'),
    note_y2: AppState.get('note_y2'),
    note_type: AppState.get('note_type'),
    note_color: AppState.get('note_color'),
    note_size: AppState.get('note_size'),
  };
}, NotesLayer);  