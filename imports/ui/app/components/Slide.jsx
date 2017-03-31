import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import classNames from 'classnames';
 
import AppState from '/imports/api/appState.js';
import { Slides } from '/imports/api/slides.js';

// Slide component - represents the slide in the whiteboard
class Slide extends Component {

  render() {
    const {slide, style} = this.props;
    return (
      <img style={style} src={slide}/>
    );
  }
}
 
export default createContainer(() => {
  Meteor.subscribe('slides');
  return {
    slide: Slides.findOne({active: true}) && Slides.findOne({active: true}).data,
  };
}, Slide);