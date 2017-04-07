import React from 'react';
import AppState from '/imports/api/appState';
import Colors from '/imports/api/colors';
import Sizes from '/imports/api/sizes';
import PathSimplifier from '/imports/api/pathSimplifier';

import Line from '/imports/ui/app/components/notes/Line.jsx';
import Arrow from '/imports/ui/app/components/notes/Arrow.jsx';
import Box from '/imports/ui/app/components/notes/Box.jsx';
import Circle from '/imports/ui/app/components/notes/Circle.jsx';
import Drawing from '/imports/ui/app/components/notes/Drawing.jsx';

const cursorOffset = 10;
const notes = {
  drawing: (note) => <Drawing {...note} key={note._id}/>,
  /*text: (note) => <Text {...note} key={note._id}/>,*/
  line: (note) => <Line {...note} key={note._id}/>,
  arrow: (note) => <Arrow {...note} key={note._id}/>,
  circle: (note) => <Circle {...note} key={note._id}/>,
  box: (note) => <Box {...note} key={note._id}/>,
};
const initNote = {
  drawing: (event) => MultiPointNote.init(event),
  /*text: (event) => OnePointNote.init(event),*/
  line: (event) => TwoPointNote.init(event),
  arrow: (event) => TwoPointNote.init(event),
  circle: (event) => TwoPointNote.init(event),
  box: (event) => TwoPointNote.init(event),
};
const captureNote = {
  drawing: (event) => MultiPointNote.capture(event),
  /*text: (event) => OnePointNote.capture(event),*/
  line: (event) => TwoPointNote.capture(event),
  arrow: (event) => TwoPointNote.capture(event),
  circle: (event) => TwoPointNote.capture(event),
  box: (event) => TwoPointNote.capture(event),
};


export default NotesLayer = {
  fetchNoteData() {
    const data = AppState.get('note_data');
    return {
      type: AppState.get('note_type'),
      data: AppState.get('note_data'),
      color: Colors.getHex(AppState.get('note_color')),
      size: Sizes.get(AppState.get('note_size')),
    };
  },
  fetchNote(note) {
    return notes[note.type](note);
  },
  startTaking(event) {
    const note = AppState.get('note_type');
    initNote[note](event)
  },
  takeNote(event) {
    const note = AppState.get('note_type');
    captureNote[note](event)
  },
  stopTaking(event) {
    AppState.set('note_displaying', false);
    const insertNote = `${AppState.get('note_type')}.insert`;
    const note = NotesLayer.fetchNoteData();
    Meteor.call(insertNote, note, handleStickyNote);
  },
};

const generateCoords = (event) => {
  let coords = {
    x: (event.nativeEvent.offsetX || event.nativeEvent.touches[0].clientX),
    y: (event.nativeEvent.offsetY || event.nativeEvent.touches[0].clientY),
  }
  coords.x += cursorOffset;
  coords.y += cursorOffset;
  return coords;
};
const handleStickyNote = (error, note) => {
  const areNotesSticky = AppState.get('notes_sticky');
  if (!areNotesSticky) {
    const nextNote = AppState.get('note_sticky_next');
    if (nextNote) {
      Meteor.call('notes.remove', nextNote);
    }
    AppState.set('note_sticky_next', note);
  }
};
const TwoPointNote = {
  init(event) {
    const coords = generateCoords(event);
    AppState.set({
      'note_displaying': true,
      'note_data': {
        'x1': coords.x,
        'y1': coords.y,
        'x2': coords.x,
        'y2': coords.y,
      }
    });
  },
  capture(event) {
    const isNoteDisplaying = AppState.get('note_displaying');
    if (isNoteDisplaying) {
      const coords = generateCoords(event);
      const data = AppState.get('note_data');
      data.x2 = coords.x;
      data.y2 = coords.y;
      AppState.set('note_data', data);
    }
  },
}
const MultiPointNote = {
  init(event) {
    const coords = generateCoords(event);
    AppState.set({
      'note_displaying': true,
      'note_data': [{
        'x': coords.x,
        'y': coords.y,
      }]
    });
  },
  capture(event) {
    const isNoteDisplaying = AppState.get('note_displaying');
    if (isNoteDisplaying) {
      const coords = generateCoords(event);
      const data = AppState.get('note_data');
      data.push({
        x: coords.x,
        y: coords.y,
      });
      const simplifiedData = PathSimplifier(data, 2.0, true);
      AppState.set('note_data', simplifiedData);
    }
  },
}