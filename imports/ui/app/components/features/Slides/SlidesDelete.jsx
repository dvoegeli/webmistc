import { Meteor } from 'meteor/meteor';
import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import classNames from 'classnames';
import AppState from '/imports/api/appState.js';
import { Slides } from '/imports/api/slides.js';

import ConfirmationButtons from '../../ConfirmationButtons.jsx';

// SlidesDelete component - button to delete current slide
class SlidesDelete extends Component {
  constructor(props) {
    super(props);
    this.state = {
      confirming: false,
    };
    this.cancel = this.cancel.bind(this);
    this.delete = this.delete.bind(this);
  }
  confirm(){
    this.setState({ 'confirming': true });
  }
  delete(event){
    console.log('deleteing active slide')
    event.stopPropagation();
    //Meteor.call('erase.slide');
    Meteor.call('slides.delete');
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
          <ConfirmationButtons cancel={this.cancel} execute={this.delete} />
        ) : (
          <i className="fa-trash fa fa-lg fa-fw w3-margin-right"/>
        )}
        {!confirming ? 'Delete' : ''}
        
      </a>
    );
  }
}
SlidesDelete.propTypes = {};

export default createContainer(() => {
  return {};
}, SlidesDelete);
