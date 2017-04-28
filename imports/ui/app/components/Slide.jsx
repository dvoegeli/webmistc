import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { Slides } from '/imports/api/slides';
import _ from 'lodash';

// Slide component - represents the slide in the whiteboard
class Slide extends Component {
  constructor(props) {
    super(props);
    this.slide; // reference to the ReactDOM element
    this.updateDims = _.debounce(this.updateDimensions.bind(this), 100 );
  }  
  componentDidMount() {
    this.updateDimensions();
    window.addEventListener('resize', this.updateDimensions.bind(this))

  }
  updateDimensions() {
    // REFACTOR
    const { whiteboard_width, whiteboard_height, whiteboard_fullscreen } = this.props;
    const slide = $(this.slide); 
    const slide_width = slide.width();
    const slide_height = slide.height();
    if(slide_width > whiteboard_width){
      slide.css('height', '');
      slide.css('width', '100%');
    }
    if(slide_height > whiteboard_height){
      slide.css('height', '100%');
      slide.css('width', '');
    }
    if(whiteboard_fullscreen){
      if(slide_width > slide_height){
        slide.css('width', '');
        slide.css('height', '100%');
      } else if(slide_width <= slide_height){
        slide.css('height', '');
        slide.css('width', '100%');
      }
    }
    AppState.set({
      notes_layer_width: slide.width(),
      notes_layer_height: slide.height(),
      slide_width: slide.width(),
      slide_height: slide.height(),
    });
  }
  render() {
    this.updateDims();
    const { whiteboard_width, whiteboard_height } = this.props;
    const style = {
      height: '100%',
      width: '',
      margin: 0,
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      userSelect: 'none',
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
  whiteboard_fullscreen: PropTypes.bool.isRequired,
};
 
export default createContainer(() => {
  Meteor.subscribe('slides');
  return {
    slide: Slides.activeSlide('data'),
    whiteboard_height: AppState.get('whiteboard_height'),
    whiteboard_width: AppState.get('whiteboard_width'),
    whiteboard_fullscreen: AppState.get('whiteboard_fullscreen'),
  };
}, Slide);