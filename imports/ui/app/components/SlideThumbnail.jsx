import React, { Component, PropTypes } from 'react';
import _ from 'lodash';
import { createContainer } from 'meteor/react-meteor-data';
import classNames from 'classnames';
import AppState from '/imports/api/appState.js';

// SlideThumbnail component - small preview image of a slide
class SlideThumbnail extends Component {
  changeSlide(){
    AppState.set('slide_active', this.props.key);
  }

  render() {
    console.log(this.props)
    const {key, active, slide} = this.props;
    const thumbnail = classNames(
      'slide-nav__slide clickable w3-margin flex-absolute-center', {
      'w3-white w3-text-grey w3-card-2': !_.isEqual(key, active),
      'slide-nav__active w3-teal w3-card-4 w3-padding': _.isEqual(key, active),
    })
    return (
      <a className={thumbnail} onClick={()=>this.changeSlide()}>
        <img width='auto' height='95%' src={this.props.slide}/>
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