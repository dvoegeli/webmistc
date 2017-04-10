import AppState from '/imports/api/appState';
import _ from 'lodash';

export default StickyNotes = {
  handler(error, note) {
    const areNotesSticky = AppState.get('notes_sticky');
    if (!areNotesSticky) {
      const nextNote = AppState.get('note_sticky_next');
      const isDiff = !_.isEqual(note, nextNote);
      if (nextNote) {
        Meteor.call('notes.remove', nextNote);
      }
      AppState.set('note_sticky_next', note);
    }
  },
};