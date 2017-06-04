import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import classNames from 'classnames';
import AppState from '/imports/api/appState.js';

import FeatureButton from './FeatureButton.jsx';

import Questions from './features/Questions.jsx'
import Chat from './features/Chat.jsx'
import Message from './features/Message.jsx'
import Roles from './features/Roles.jsx'
import Sound from './features/Sound.jsx'
import Presentation from './features/Presentation.jsx'
import Slides from './features/Slides.jsx'
import Vote from './features/Vote.jsx'

// FeaturesMenu component - menu for features and their options
class FeaturesMenu extends Component {
  render() {
    const menu = classNames(
      'menu menu--panels w3-sidenav w3-card-8 w3-white w3-animate-right', {
      'w3-show': this.props.features_menu_open,
    });
    return (
      <nav className={menu}>
        <div className="panels-menu w3-white">
          <Roles/>
          <FeatureButton label='questions' iconClass='fa-sticky-note-o'/>
          <Questions/>
          <FeatureButton label='chat' iconClass='fa-bullhorn'/>
          <Chat/>
          <FeatureButton label='message' iconClass='fa-paper-plane-o'/>
          <Message/>
          <FeatureButton label='roles' iconClass='fa-users'/>
          <FeatureButton label='sound' iconClass='fa-microphone'/>
          <Sound/>
          <FeatureButton label='presentation' iconClass='fa-tv'/>
          <Presentation/>
          <FeatureButton label='slides' iconClass='fa-files-o'/>
          <Slides/>
          <FeatureButton label='vote' iconClass='fa-tasks'/>         
          <Vote/>
        </div>
      </nav>
    );
  }
}

FeaturesMenu.propTypes = {
  features_menu_open: PropTypes.bool.isRequired,
};

export default createContainer(() => {
  return {
    features_menu_open: AppState.get('features_menu_open'),
  };
}, FeaturesMenu);
