import React, { Component, PropTypes } from 'react';
import _ from 'lodash';
import { createContainer } from 'meteor/react-meteor-data';
import classNames from 'classnames';
import AppState from '/imports/api/appState.js';

// NoteSizeButton component - button for opening the note size options menu
class NoteSizeButton extends Component {
  toggleOptionsMenu(){
    AppState.set('sizes_menu_open', !this.props.sizes_menu_open)
  }
  render() {
    const {sizes_menu_open, note_size, select} = this.props;
    const button = classNames(
      'fa-circle fa fa-fw w3-text-grey', {
      'note-size--tiny':   _.isEqual(note_size, 'tiny'),
      'note-size--small':  _.isEqual(note_size, 'small'),
      'note-size--medium': _.isEqual(note_size, 'medium'),
      'note-size--large':  _.isEqual(note_size, 'large'),
      'note-size--huge':   _.isEqual(note_size, 'huge'),
    });
    const options = classNames(
      'menu__item-dropdown--sizes w3-dropdown-content w3-white w3-card-4', {
      'w3-show': sizes_menu_open,
    });
    return (
      <span className='roles-menu w3-dropdown-click' data-tip="Sizes">
        <span className="menu__item flex-row" onClick={()=>this.toggleOptionsMenu()}>
          <span className="menu__item-button flex-row flex-row--center">
            <i className={button}/>
          </span>
          <span className="menu__item-description">Sizes</span>
        </span>
        <div className={options}>
          <span className="flex-row flex-row--ends w3-padding-medium">
            <i className="fa-circle fa note-size--tiny w3-text-grey" onClick={()=>select('size', 'tiny')}/>
            <i className="fa-circle fa note-size--small w3-text-grey" onClick={()=>select('size', 'small')}/>
            <i className="fa-circle fa note-size--medium w3-text-grey" onClick={()=>select('size', 'medium')}/>
            <i className="fa-circle fa note-size--large w3-text-grey" onClick={()=>select('size', 'large')}/>
            <i className="fa-circle fa note-size--huge w3-text-grey" onClick={()=>select('size', 'huge')}/>
          </span>
        </div>
      </span>
    );
  }
}
 
NoteSizeButton.propTypes = {
  sizes_menu_open: PropTypes.bool.isRequired,
  note_size: PropTypes.string.isRequired,
  select: PropTypes.func.isRequired,
};
 
export default createContainer(() => {
  return {
    sizes_menu_open: AppState.get('sizes_menu_open'),
    note_size: AppState.get('note_size'),
  };
}, NoteSizeButton);