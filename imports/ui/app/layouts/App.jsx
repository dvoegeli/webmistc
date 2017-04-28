import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import classNames from 'classnames';

import AppState from '../../../api/appState.js';

import Whiteboard from '../components/Whiteboard.jsx';
import MuteButton from '../components/MuteButton.jsx';
import FullscreenButton from '../components/FullscreenButton.jsx';
import BackgroundOverlay from '../components/BackgroundOverlay.jsx';
import SlidesButton from '../components/SlidesButton.jsx';
import SlidesNavigation from '../components/SlidesNavigation.jsx';
import SlidesProgressBar from '../components/SlidesProgressBar.jsx';
import NotesMenuButton from '../components/NotesMenuButton.jsx';
import NotesMenu from '../components/NotesMenu.jsx';
import FeaturesMenuButton from '../components/FeaturesMenuButton.jsx';
import FeaturesMenu from '../components/FeaturesMenu.jsx';
import SmartAlert from '../components/SmartAlert.jsx';

export default class App extends Component {
  componentWillMount() {
    this.updateWindowDimensions();
  }

  componentDidMount() {
    window.addEventListener("resize", this.updateWindowDimensions);
  }
  updateWindowDimensions() {
    AppState.set({
      window_width: $(window).width(),
      window_height: $(window).height(),
    });
  }
  render() {
    return (
      <div>
        <MuteButton/>
        <FullscreenButton/>
        <NotesMenuButton/>
        <NotesMenu/>
        <FeaturesMenuButton/>
        <FeaturesMenu/>
        <SlidesProgressBar/>
        <SlidesButton direction='prev'/>
        <SlidesButton direction='next'/>
        <SlidesNavigation/>
        <BackgroundOverlay/>
        <Whiteboard/>
        <SmartAlert/>
      </div>
    );
  }
}