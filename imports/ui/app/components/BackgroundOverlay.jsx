import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import classNames from 'classnames';
import _ from 'lodash';
 
import AppState from '/imports/api/appState.js';
 

// BackgroundOverlay component - background overlay for menus and navigation
class BackgroundOverlay extends Component {
  closeMenus(){
    AppState.set({
      'slides_nav_open': false,
      'notes_menu_open': false, 
      'roles_menu_open': false,
      'features_menu_open': false, 
      'features_show': undefined,
    });
  }

  render() {
    const { notes_menu_open, features_menu_open, slides_nav_open} = this.props; 
    const overlay = classNames(
      'background-overlay w3-animate-opacity', {
      'w3-hide': !notes_menu_open && !features_menu_open && !slides_nav_open,
      'w3-show': notes_menu_open  || features_menu_open || slides_nav_open,
    });
    return (
      <div className={overlay} onClick={this.closeMenus}></div>
    );
  }
}
 
BackgroundOverlay.propTypes = {
  notes_menu_open: PropTypes.bool.isRequired,
  features_menu_open: PropTypes.bool.isRequired,
  slides_nav_open: PropTypes.bool.isRequired,
};
 
export default createContainer(() => {
  return {
    notes_menu_open: AppState.get('notes_menu_open'),
    features_menu_open: AppState.get('features_menu_open'),
    slides_nav_open: AppState.get('slides_nav_open'),
  };
}, BackgroundOverlay);