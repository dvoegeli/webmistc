import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import classNames from 'classnames';
import _ from 'lodash';
 
import { AppState } from '../../../api/appState.js';
 

// BackgroundOverlay component - background overlay for menus and navigation
class BackgroundOverlay extends Component {
  // closeMenus(){
  //   _.merge(this.state.notes, { menuOpened: false });
  //   _.merge(this.state.panels, { 
  //     menuOpened: false, 
  //     showing: {
  //       questions: false,
  //       chat: false,
  //       message: false,
  //       roles: false,
  //       sound: false,
  //       presentationControl: false,
  //       importExport: false,
  //       vote: false,
  //   }});
  //   _.merge(this.state.roles, { menuOpened: false });
  //   _.merge(this.state.slides, { menuOpened: false });
  //   this.setState(this.state);
  // }
  closeMenus(){
    AppState.set(feature_menus_to_hide)
    AppState.set('notes_menu_open', false); 
    AppState.set('slides_menu_open', false);
    AppState.set('features_menu_open', false); 
    AppState.set('features_menu_show_questions', false);
    AppState.set('features_menu_show_chat', false);
    AppState.set('features_menu_show_message', false);
    AppState.set('features_menu_show_roles', false);
    AppState.set('features_menu_show_sound', false);
    AppState.set('features_menu_show_presentationControl', false);
    AppState.set('features_menu_show_importExport', false);
    AppState.set('features_menu_show_vote', false);
  }

  render() {
    const overlay = classNames(
      'overlay w3-animate-opacity', {
      'w3-hide': !this.state.notes.menuOpened && !this.state.panels.menuOpened && !this.state.slides.menuOpened,
      'w3-show': this.state.notes.menuOpened || this.state.panels.menuOpened || this.state.slides.menuOpened,
    });
    return (
      <div className={overlay} onClick={this.closeMenus} style={{cursor:"pointer"}}></div>
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
    notes_menu_opened: AppState.get('notes_menu_opened'),
    features_menu_opened: AppState.get('features_menu_opened'),
    slides_nav_opened: AppState.get('slides_nav_opened'),
  };
}, BackgroundOverlay);