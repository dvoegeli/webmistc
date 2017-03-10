import React, { Component, PropTypes } from 'react';
import _ from 'lodash';
import { createContainer } from 'meteor/react-meteor-data';
import classNames from 'classnames';
import AppState from '/imports/api/appState.js';

// SlideThumbnail component - small preview image of a slide
class SlideThumbnail extends Component {
  changeSlide(){
    AppState.set('slide_active', this.props.label);
  }

  render() {
    const {label, active} = this.props;
    const thumbnail = classNames(
      'slide-nav__slide clickable w3-margin flex-absolute-center', {
      'w3-white w3-text-grey w3-card-2': !_.isEqual(label, active),
      'slide-nav__active w3-teal w3-card-4 w3-padding': _.isEqual(label, active),
    })
    return (
      <a className={thumbnail} onClick={()=>this.changeSlide()}>
        <h3>{this.props.label}</h3>
      </a>
    );
  }
}
 
SlideThumbnail.propTypes = {
  active: PropTypes.string.isRequired,
};
 
export default createContainer(() => {
  return {
    active: AppState.get('slide_active'),
  };
}, SlideThumbnail);