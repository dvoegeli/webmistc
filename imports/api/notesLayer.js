import React from 'react';
import AppState from '/imports/api/appState';
import Colors from '/imports/api/colors';
import Sizes from '/imports/api/sizes';

import Line from '/imports/ui/app/components/notes/Line.jsx';
import Arrow from '/imports/ui/app/components/notes/Arrow.jsx';
import Box from '/imports/ui/app/components/notes/Box.jsx';
import Circle from '/imports/ui/app/components/notes/Circle.jsx';

export default NotesLayer = {};

const cursorOffset = 10;
const notes = { 
  /*draw: (note) => <Draw {...note} key={note._id}/>,*/
  /*text: (note) => <Text {...note} key={note._id}/>,*/
  line:   (note) => <Line {...note} key={note._id}/>,
  arrow:  (note) => <Arrow {...note} key={note._id}/>,
  circle: (note) => <Circle {...note} key={note._id}/>,
  box:    (note) => <Box {...note} key={note._id}/>,
};

NotesLayer.generateCoords = (event) => {
  let coords = {
    x: (event.nativeEvent.offsetX || event.nativeEvent.touches[0].clientX ),
    y: (event.nativeEvent.offsetY || event.nativeEvent.touches[0].clientY ),
  }
  coords.x += cursorOffset;
  coords.y += cursorOffset;
  return coords;
}

NotesLayer.generateNote = () => {
  return {
    type: AppState.get('note_type'),
    x1: AppState.get('note_x1'), 
    y1: AppState.get('note_y1'),
    x2: AppState.get('note_x2'), 
    y2: AppState.get('note_y2'),
    color: Colors.getHex(AppState.get('note_color')),
    size: Sizes.get(AppState.get('note_size')),
  };
}

NotesLayer.fetch = (note) => {
  return notes[note.type](note);
}

NotesLayer.startTaking = (event) => { 
  const coords = NotesLayer.generateCoords(event);// should be dynamic
  // should be dynamic
  AppState.set({
    'note_displaying': true,
    'note_x1': coords.x,
    'note_y1': coords.y,
    'note_x2': coords.x,
    'note_y2': coords.y,
  });
}
NotesLayer.takeNote = (event) => { /*extract to note layer api*/
  const isNoteDisplaying = AppState.get('note_displaying');
  if(isNoteDisplaying){
    const coords = NotesLayer.generateCoords(event);// should be dynamic
    AppState.set('note_x2', coords.x);// should be dynamic
    AppState.set('note_y2', coords.y);// should be dynamic
  }
}
NotesLayer.stopTaking = (event) => { /*extract to note layer api*/
  AppState.set('note_displaying', false);
  const insertNote = `${AppState.get('note_type')}.insert`;
  const note = NotesLayer.generateNote();
  const stickyNote = NotesLayer.handleStickyNote;
  Meteor.call(insertNote, note, stickyNote);
}

NotesLayer.handleStickyNote = (error, note) => { /*extract to note layer api*/
  const areNotesSticky = AppState.get('notes_sticky');
  if(!areNotesSticky){
    const nextNote = AppState.get('note_sticky_next');
    if(nextNote){
      Meteor.call('notes.remove', nextNote);
    }
    AppState.set('note_sticky_next', note);
  }
}