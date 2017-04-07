import React, { Component, PropTypes } from 'react';
import _ from 'lodash';
import { createContainer } from 'meteor/react-meteor-data';
import classNames from 'classnames';
import ReactTooltip from 'react-tooltip';
 
import AppState from '/imports/api/appState.js';

import StickyNotesButton from './notes/StickyNotesButton.jsx';
import DrawingButton from './notes/DrawingButton.jsx';
import TextButton from './notes/TextButton.jsx';
import LineButton from './notes/LineButton.jsx';
import ArrowButton from './notes/ArrowButton.jsx';
import CircleButton from './notes/CircleButton.jsx';
import BoxButton from './notes/BoxButton.jsx';
import EraserButton from './notes/EraserButton.jsx';
import ClearSlideButton from './notes/ClearSlideButton.jsx';
import NoteColorButton from './notes/NoteColorButton.jsx';
import NoteSizeButton from './notes/NoteSizeButton.jsx';
import RolesMenuButton from './RolesMenuButton.jsx';
 

// NoteMenu component - note and role options
class NoteMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      window_width: undefined,
      window_height: undefined,
    };
  }
  componentWillMount() {
    this.updateWindowDimensions();
  }

  componentDidMount() {
    window.addEventListener("resize", this.updateWindowDimensions.bind(this));
  }
  updateWindowDimensions() {
    this.setState({
      window_width: $(window).width(),
      window_height: $(window).height(),
    });
  }
  changeNote(property, setting){
    AppState.set({
      [`note_${property}`]: setting,
      'colors_menu_open': false,
      'sizes_menu_open': false,
    });
  }
  render() {
    const noteMenu = classNames(
      'menu menu--notes w3-card-8 w3-animate-left',{
      'w3-show': AppState.get('notes_menu_open'),
    }); 
     
    return (
      <nav className={noteMenu}>
        <div className="notes-menu w3-text-teal">
          <ReactTooltip 
            place="right" 
            class="tooltip" 
            effect="solid" 
            delayShow={1000} 
            disable={ this.state.window_width > 900 ? false : true }
          />
          <StickyNotesButton/>
          <DrawingButton select={this.changeNote}/>
          <TextButton select={this.changeNote}/>
          <LineButton select={this.changeNote}/>
          <ArrowButton select={this.changeNote}/>
          <BoxButton select={this.changeNote}/>
          <CircleButton select={this.changeNote}/>
          <EraserButton select={this.changeNote}/>
          <ClearSlideButton/>
          <NoteColorButton select={this.changeNote}/>
          <NoteSizeButton select={this.changeNote}/>
          <RolesMenuButton/>
        </div>
      </nav>
    );
  }
}

NoteMenu.propTypes = {
  notes_menu_open: PropTypes.bool.isRequired,
};
 
export default createContainer(() => {
  return {
    notes_menu_open: AppState.get('notes_menu_open'),
  };
}, NoteMenu);