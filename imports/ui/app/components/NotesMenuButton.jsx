import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import classNames from 'classnames';
 
import AppState from '/imports/api/appState.js';
 

// NoteMenuButton component - button for note menu
class NoteMenuButton extends Component {
  toggleNoteMenu(){
     AppState.set('notes_menu_open', !this.props.notes_menu_open);
  }

  render() {
    const button = classNames(
      'notes-menu-btn ripple',
      'w3-btn w3-btn-floating-large',
      'w3-card-2 w3-teal w3-text-white',
      'w3-hide-large'
    );
    return (
      <button className={button} onClick={this.toggleNoteMenu}>
        <i className="fa-pencil fa fa-fw"/>
      </button>
    );
  }
}
 
 
NoteMenuButton.propTypes = {
  notes_menu_open: PropTypes.bool.isRequired,
};
 
export default createContainer(() => {
  return {
    notes_menu_open: AppState.get('notes_menu_open'),
  };
}, NoteMenuButton);