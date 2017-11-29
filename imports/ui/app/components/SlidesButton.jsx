import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import classNames from 'classnames';
import _ from 'lodash';
 
import AppState from '/imports/api/appState.js';

// SlidesButton component - button to control slides
class SlidesButton extends Component {
  moveSlide(){
    Meteor.call('slides.move', this.props.direction);
  }

  render() {
    const {direction} = this.props;
    const button = classNames(
      'clickable w3-text-teal w3-opacity-max', {
      'slide-nav-prev': _.isEqual(direction, 'prev'),
      'slide-nav-next': _.isEqual(direction, 'next'),
      'slide-nav-prev--fullscreen': _.isEqual(direction, 'prev') && this.props.whiteboard_fullscreen,
      'slide-nav-next--fullscreen': _.isEqual(direction, 'next') && this.props.whiteboard_fullscreen,
    });
    const icon = classNames(
      'fa fa-4x', {
      'fa-chevron-left ': _.isEqual(direction, 'prev'),
      'fa-chevron-right ': _.isEqual(direction, 'next'),
    });
    return (
      <span className={button} onClick={()=>this.moveSlide()}>
        <i className={icon}/>
      </span>
    );
  }
}
 
SlidesButton.propTypes = {
  whiteboard_fullscreen: PropTypes.bool.isRequired,
  direction: PropTypes.string.isRequired,
};
 
export default createContainer(() => {
  return {
    whiteboard_fullscreen: AppState.get('whiteboard_fullscreen'),
  };
}, SlidesButton);