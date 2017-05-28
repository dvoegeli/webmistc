import { Meteor } from 'meteor/meteor';
import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import classNames from 'classnames';
import AppState from '/imports/api/appState.js';
import { Slides } from '/imports/api/slides.js';

// SlidesBlank component - button to insert a blank slide
class SlidesBlank extends Component {
  constructor(props) {
    super(props);
  }
  insertBlankSlide() {
    // slide resolution is 16:9
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    context.beginPath();
    context.rect(0, 0, 1366, 768);
    context.fillStyle = 'white';
    context.fill();
    Meteor.call('slides.offset', 1);
    Meteor.call('slides.blank', {
      data: canvas.toDataURL('image/png'),
    });
  }
  render() {
    return (
      <a className="flex-row w3-padding-0 w3-section w3-text-teal" href="#!"
        onClick={() => this.insertBlankSlide()}
      >
        <i className="fa-file-o fa fa-lg fa-fw w3-margin-right"/>
        Blank Slide
      </a>
    );
  }
}
SlidesBlank.propTypes = {};

export default createContainer(() => {
  return {};
}, SlidesBlank);
