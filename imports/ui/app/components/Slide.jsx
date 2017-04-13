import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { Slides } from '/imports/api/slides';

// Slide component - represents the slide in the whiteboard
class Slide extends Component {
  // the note layer should have the same width/height as the slide
  // and they should move around in a similiar manner, e.g. hor/vert middle
  // so there is consistency when resizing the window
  //
  // slide in middle (horizontal and vertical) of whiteboard
  // slide.width < whiteboard.width ? height 100% : width 100%
  constructor(props) {
    super(props);
    this.slide; // reference to the whiteboard ReactDOM element
  }  
  componentDidMount() {
    this.updateDimensions();
    console.log(this.slide)
    console.log(this.slide.width)
    window.addEventListener("resize", this.updateDimensions.bind(this));
  }
  updateDimensions() {
    const { slide } = this;
    AppState.set({
      slide_width: $(slide).width(),
      slide_height: $(slide).height(),
    });
  }
  render() {
    const { whiteboard_width, whiteboard_height } = this.props;
    console.log('whiteboard width: ' + whiteboard_width);
    console.log('whiteboard height: ' + whiteboard_height);
    const style = {
      height: whiteboard_height < whiteboard_width ? '100%' : '',
      width: whiteboard_width < whiteboard_height ? '100%' : '',
      margin: 0,
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
    };
    const {slide} = this.props;
    return (
      <img style={style} src={slide}
        ref={(slide)=>{this.slide = slide}}
        onLoad={()=>{this.updateDimensions()}}
      />
    );
  }
}

Slide.propTypes = {
  whiteboard_height: PropTypes.number,
  whiteboard_width: PropTypes.number,
};
 
export default createContainer(() => {
  Meteor.subscribe('slides');
  return {
    slide: Slides.activeSlide('data'),
    whiteboard_height: AppState.get('whiteboard_height'),
    whiteboard_width: AppState.get('whiteboard_width'),
  };
}, Slide);