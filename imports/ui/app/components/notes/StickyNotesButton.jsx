import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import classNames from 'classnames';
 
import AppState from '/imports/api/appState.js';
 

// StickyNotesButton component - button for toggling sticky notes
// On means the next note sticks to the whiteboard
// Off means the next note replaces the previous note on the whiteboard
class StickyNotesButton extends Component {
  toggleStickyNotes(){
    AppState.set('notes_sticky', !this.props.notes_sticky);
  }
  render() {
    const {notes_sticky} = this.props
    const button = classNames(
      'fa fa-lg fa-fw', {
      'fa-toggle-on w3-text-green': notes_sticky,
      'fa-toggle-off w3-text-pink': !notes_sticky,
    }); 
    return (
      <span 
        className="menu__item flex-row" data-tip="Sticky Notes" 
        onClick={()=>this.toggleStickyNotes()}
      >
        <span className="menu__item-button flex-row flex-row--center">
          <i className={button}/>
        </span>
        <span className="menu__item-description">
          Sticky Notes
        </span>
      </span>
    );
  }
}
 
StickyNotesButton.propTypes = {
  notes_sticky: PropTypes.bool.isRequired,
};
 
export default createContainer(() => {
  return {
    notes_sticky: AppState.get('notes_sticky'),
  };
}, StickyNotesButton);