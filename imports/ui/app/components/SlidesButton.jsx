import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import classNames from 'classnames';
import _ from 'lodash';
 
import AppState from '/imports/api/appState.js';

// SlidesButton component - button to control slides
class SlidesButton extends Component {
  moveSlide(){
    let {slides_labels, direction, slide_active} = this.props;
    let active_slide = _.findIndex(slides_labels, (slide) =>
      _.isEqual(slide, slide_active)
    );
    switch(direction) {
      case 'prev':
        active_slide -= 1;
        break;
      case 'next':
        active_slide += 1;
        break;
    }
    const moveIsValid = (0 <= active_slide) && (active_slide < slides_labels.length);
    if(moveIsValid){
      AppState.set('slide_active', slides_labels[active_slide]);
    }
  }

  render() {
    const {direction} = this.props;
    const button = classNames(
      'clickable w3-text-teal w3-opacity-max', {
      'slide-nav-prev': _.isEqual(direction, 'prev'),
      'slide-nav-next': _.isEqual(direction, 'next'),
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
  direction: PropTypes.string.isRequired,
  slides_labels: PropTypes.arrayOf(React.PropTypes.string),
  slide_active: PropTypes.string.isRequired,
};
 
export default createContainer(() => {
  return {
    slides_labels: AppState.get('slides_labels'),
    slide_active: AppState.get('slide_active')
  };
}, SlidesButton);