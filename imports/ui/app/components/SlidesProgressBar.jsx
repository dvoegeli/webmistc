import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import classNames from 'classnames';
 
import AppState from '/imports/api/appState.js';
import { Slides } from '/imports/api/slides.js';
 

// SlidesProgressBar component - progress bar for slide progress
class SlidesProgressBar extends Component {
  toggleSlideNav(){
    AppState.set('slides_nav_open', !this.props.slides_nav_open);
  }
  render() {
    const active = this.props.active || 0;
    const slides = this.props.slides || 0;
    const progress = (active / slides) * 100 || 0;
    return (
      <div className="slide-nav-progress clickable w3-progress-container w3-grey w3-opacity" onClick={()=>this.toggleSlideNav()}>
        <div className="w3-progressbar w3-blue-grey" style={{zIndex: -1, width: progress + '%'}}/>
        <div className="w3-center w3-text-white">{`${active}/${slides}`}</div>
      </div>
    );
  }
}
 
 
SlidesProgressBar.propTypes = {
  slides_nav_open: PropTypes.bool.isRequired,
};
 
export default createContainer(() => {
  Meteor.subscribe('slides');
  return {
    slides_nav_open: AppState.get('slides_nav_open'),
    slides: Slides.find({}).count(),
    active: Slides.findOne({active: true}) && Slides.findOne({active: true}).number,
  };
}, SlidesProgressBar);