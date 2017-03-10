import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import classNames from 'classnames';
 
import AppState from '/imports/api/appState.js';
 

// SlidesProgressBar component - progress bar for slide progress
class SlidesProgressBar extends Component {
  toggleSlideNav(){
    AppState.set('slides_nav_open', !this.props.slides_nav_open);
  }
  render() {
    return (
      <div className="slide-nav-progress clickable w3-progress-container w3-grey w3-opacity" onClick={()=>this.toggleSlideNav()}>
        <div className="w3-progressbar w3-blue-grey" style={{width: 42 + '%'}}>
        </div>
        <div className="w3-center w3-text-white">10/23</div>
      </div>
    );
  }
}
 
 
SlidesProgressBar.propTypes = {
  slides_nav_open: PropTypes.bool.isRequired,
};
 
export default createContainer(() => {
  return {
    slides_nav_open: AppState.get('slides_nav_open'),
  };
}, SlidesProgressBar);