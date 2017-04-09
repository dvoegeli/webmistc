import React from 'react';
import AppState from '/imports/api/appState';
import Colors from '/imports/api/colors';
import Sizes from '/imports/api/sizes';
import PathSimplifier from '/imports/api/pathSimplifier';

import Drawing from '/imports/ui/app/components/notes/Drawing.jsx';
import Text from '/imports/ui/app/components/notes/Text.jsx';
import Line from '/imports/ui/app/components/notes/Line.jsx';
import Arrow from '/imports/ui/app/components/notes/Arrow.jsx';
import Box from '/imports/ui/app/components/notes/Box.jsx';
import Circle from '/imports/ui/app/components/notes/Circle.jsx';

const cursorOffset = 10;
const notes = {
  drawing: Drawing,
  text: Text,
  line: Line,
  arrow: Arrow,
  circle: Circle,
  box: Box,
};

const captures = {
  drawing: (event) => captureNote(event, ['points']),
  text: (event) => captureNote(event, ['end-point']),
  line: (event) => captureNote(event, ['end-point']),
  arrow: (event) => captureNote(event, ['end-point']),
  circle: (event) => captureNote(event, ['end-point']),
  box: (event) => captureNote(event, ['end-point']),
};

export default NotesLayer = {
  fetchNoteData() {
    const data = AppState.get('note_data');
    return {
      type: AppState.get('note_type'),
      data: AppState.get('note_data'),
      color: AppState.get('note_color'),
      size: AppState.get('note_size'),
    };
  },
  fetchNote(note) {
    const Note = notes[note.type];
    return <Note {...note} key={note._id}/>;
  },
  startTaking(event) {
    const note = AppState.get('note_type');
    initNote(event);
  },
  takeNote(event) {
    const note = AppState.get('note_type');
    captures[note](event);
  },
  stopTaking(noteType) {
    AppState.set('note_displaying', false);
    const note = NotesLayer.fetchNoteData();
    const insertNote = `${note.type}.insert`;
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
const captureNote = (event, data) => {
  const note = data.reduce((data, datum) => {
    return Object.assign(data, Capture[datum](event));
  }, {});
  AppState.set('note_data', note)
}

const initNote = (event) => {
  const coords = generateCoords(event);
  const initial = {
    'x': coords.x,
    'y': coords.y,
  };
  AppState.set({
    'note_displaying': true,
    'note_data': {
      coords: [initial, initial],
    }
  });
}
const Capture = {
  'end-point' (event) {
    const coords = generateCoords(event);
    const data = AppState.get('note_data');
    data.coords[1] = {
      x: coords.x,
      y: coords.y,
    }
    return data;
  },
  points(event) {
    const coords = generateCoords(event);
    const data = AppState.get('note_data');
    data.coords.push({
      x: coords.x,
      y: coords.y,
    });
    data.coords = PathSimplifier(data.coords, 0.9, true);
    return data;
  },
}