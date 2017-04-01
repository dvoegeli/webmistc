import React, { Component } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { Slides } from '/imports/api/slides';

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