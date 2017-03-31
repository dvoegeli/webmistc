import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import classNames from 'classnames';
import AppState from '/imports/api/appState.js';

// ClearSlideButton component - button for clearing notes off the current slide
class ClearSlideButton extends Component {
  render() {
    return (
      <span className="menu__item flex-row" data-tip="Clear Slide">
        <span className="menu__item-button flex-row flex-row--center">
          <span className="notes-menu__clear-slide fa-stack fa-fw">
            <i className="fa fa-sticky-note-o fa-stack-2x"></i>
            <i className="fa fa-eraser fa-stack-1x"></i>
          </span>
        </span>
        <span className="menu__item-description">
          Clear Slide
        </span>
      </span>
    );
  }
}
 
ClearSlideButton.propTypes = {

};
 
export default createContainer(() => {
  return {

  };
}, ClearSlideButton);