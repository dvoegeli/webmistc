import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import classNames from 'classnames';
import _ from 'lodash';
 
import AppState from '/imports/api/appState.js';

// SlidesButton component - button to control slides
class SlidesButton extends Component {
  moveSlide(){
    const {slides_labels, direction, slide_active} = this.props;
    const active = _.findIndex(slides_labels, (slide)=>_.isEqual(slide, slide_active));
    if(_.isEqual(direction, 'prev') && (active - 1) >= 0){
      AppState.set('slide_active', slides_labels[active - 1]);
    }
    if(_.isEqual(direction, 'next') && (active + 1) <= slides_labels.length){
      AppState.set('slide_active', slides_labels[active + 1]);
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