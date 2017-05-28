import { Meteor } from 'meteor/meteor';
import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import classNames from 'classnames';
import AppState from '/imports/api/appState.js';
import { Slides } from '/imports/api/slides.js';

import ConfirmationButtons from '../../ConfirmationButtons.jsx';

// SlidesReset component - button to delete all slides
class SlidesReset extends Component {
  constructor(props) {
    super(props);
    this.state = {
      confirming: false,
    };
    this.cancel = this.cancel.bind(this);
    this.reset = this.reset.bind(this);
  }
  confirm(){
    this.setState({ 'confirming': true });
  }
  reset(event){
    event.stopPropagation();
    Meteor.call('erase.presentation');
    Meteor.call('slides.reset');
    this.setState({ 'confirming': false });
  }
  cancel(event){
    event.stopPropagation();
    this.setState({ 'confirming': false });
  }

  render() {
    const { confirming } = this.state;
    return (
      <a className="flex-row w3-padding-0 w3-section w3-text-teal" href="#!"
        onClick={() => this.confirm()}
      >
        { confirming ? (
          <ConfirmationButtons cancel={this.cancel} execute={this.reset} />
        ) : (
          <i className="fa-bomb fa fa-lg fa-fw w3-margin-right"/>
        )}
        {!confirming ? 'Reset' : ''}
        
      </a>
    );
  }
}
SlidesReset.propTypes = {};

export default createContainer(() => {
  return {};
}, SlidesReset);
