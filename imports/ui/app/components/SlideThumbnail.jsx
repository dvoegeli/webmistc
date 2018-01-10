import React, { Component, PropTypes } from 'react';
import _ from 'lodash';
import { createContainer } from 'meteor/react-meteor-data';
import classNames from 'classnames';
import AppState from '/imports/api/appState.js';

// SlideThumbnail component - small preview image of a slide
class SlideThumbnail extends Component {
  changeSlide(){
    Meteor.call('slides.move', this.props.number);
  }

  render() {
    const {slide, active} = this.props;
    const thumbnail = classNames(
      'clickable w3-margin flex-absolute-center', {
      'w3-white w3-card-2': !active,
      'w3-teal w3-card-4 w3-padding': active,
    })
    return (
      <a className={thumbnail} onClick={()=>this.changeSlide()}>
        <img witdth='auto' height='175vw' src={slide}/>
      </a>
    );
  }
}
 
SlideThumbnail.propTypes = {
  slide: PropTypes.string.isRequired,
  number: PropTypes.number.isRequired,
  active: PropTypes.bool.isRequired,
};
 
export default createContainer(() => {
  return {};
}, SlideThumbnail);