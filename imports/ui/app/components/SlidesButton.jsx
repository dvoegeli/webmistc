import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import classNames from 'classnames';
import _ from 'lodash';
 
import { AppState } from '../../../api/appState.js';
 

// SlidesButton component - button to control slides
class SlidesButton extends Component {
  moveSlide(direction){
    // per lodash, (iteration order is not guaranteed, so this may break occasionaly)
    let slidesArray = _.toPairs(this.state.slides.active);
    const activeSlideIndex = _.findIndex(slidesArray, (slide) => slide[1] );
    try {
      if (_.isEqual(direction, 'prev') ){
        var moveDir = -1;
      } else if (_.isEqual(direction, 'next') ){
        var moveDir = 1;
      }
      slidesArray[activeSlideIndex + moveDir][1] = true;
      slidesArray[activeSlideIndex][1] = false;
    } catch (error) {
      // there isn't a next or previous
    }
    const slidesObject = _.fromPairs(slidesArray);
    AppState.set(slidesObject);
  }

  render() {
    const button = classNames(
      'clickable w3-text-teal w3-opacity-max', {
      'slide-nav-prev': _.isEqual(this.props.direction, 'prev'),
      'slide-nav-next': _.isEqual(this.props.direction, 'next'),
    });
    const icon = classNames(
      'fa fa-4x', {
      'fa-chevron-left ': _.isEqual(this.props.direction, 'prev'),
      'fa-chevron-right ': _.isEqual(this.props.direction, 'next'),
    });
    return (
      <span className={button} onClick={this.moveSlide.bind(this, this.props.direction)}>
        <i className={icon}/>
      </span>
    );
  }
}
 
 
SlidesButton.propTypes = {
  /*direction: PropTypes.string.isRequired,*/
};
 
export default createContainer(() => {
  return {
    /*direction: AppState.get('direction'),*/
  };
}, SlidesButton);