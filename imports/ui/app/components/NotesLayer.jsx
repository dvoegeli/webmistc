import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import classNames from 'classnames';
 
import AppState from '/imports/api/appState.js';
import { Notes } from '/imports/api/notes.js';
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
  }
  fetch(note){
    return this.notes[note.type](note);
  }

  render() {
    const {style} = this.props;
    return (
      <svg style={style}>
        {this.props.notes.map((note)=>this.fetch(note))}
      </svg>
    );
  }
}
 
export default createContainer(() => {
  Meteor.subscribe('notes');
  return {
    notes: Notes.find({}, { sort: { createdAt: -1 } }).fetch(),
  };
}, NotesLayer);