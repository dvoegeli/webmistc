import React, { Component, PropTypes } from 'react';
import _ from 'lodash';
import { createContainer } from 'meteor/react-meteor-data';
import classNames from 'classnames';
import AppState from '../../../../api/appState.js';

// NoteColorButton component - button for opening the note color options menu
class NoteColorButton extends Component {
  toggleOptionsMenu(){
    AppState.set('colors_menu_open', !this.props.colors_menu_open)
  }
  render() {
    const {colors_menu_open, note_color, select} = this.props;
    const button = classNames(
      'fa-circle fa fa-fw w3-large', {
      'w3-text-purple':     _.isEqual(note_color, 'purple'),
      'w3-text-light-blue': _.isEqual(note_color, 'blue'),
      'w3-text-orange':     _.isEqual(note_color, 'orange'),
      'w3-text-green':      _.isEqual(note_color, 'green'),
      'w3-text-red':        _.isEqual(note_color, 'red'),
    });
    const options = classNames(
      'menu__item-dropdown--colors w3-dropdown-content w3-white w3-card-4', {
      'w3-show': colors_menu_open,
    });
    return (
      <span className='roles-menu w3-dropdown-click' data-tip="Colors">
        <span className="menu__item flex-row" onClick={()=>this.toggleOptionsMenu()}>
        <span className="menu__item-button flex-row flex-row--center">
          <i className={button}/>
        </span>
          <span className="menu__item-description">Colors</span>
        </span>
        <div className={options}>
          <span className="flex-row flex-row--ends w3-padding-medium">
            <i className="fa-circle fa w3-large w3-text-purple" onClick={()=>select('color', 'purple')}/>
            <i className="fa-circle fa w3-large w3-text-light-blue" onClick={()=>select('color', 'blue')}/>
            <i className="fa-circle fa w3-large w3-text-orange" onClick={()=>select('color', 'orange')}/>
            <i className="fa-circle fa w3-large w3-text-green" onClick={()=>select('color', 'green')}/>
            <i className="fa-circle fa w3-large w3-text-red" onClick={()=>select('color', 'red')}/>
          </span>
        </div>
      </span>
    );
  }
} 
 
NoteColorButton.propTypes = {
  colors_menu_open: PropTypes.bool.isRequired,
  note_color: PropTypes.string.isRequired,
  select: PropTypes.func.isRequired,
};
 
export default createContainer(() => {
  return {
    colors_menu_open: AppState.get('colors_menu_open'),
    note_color: AppState.get('note_color'),
  };
}, NoteColorButton);