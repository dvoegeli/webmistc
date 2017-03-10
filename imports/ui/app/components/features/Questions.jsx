import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import classNames from 'classnames';
 
import AppState from '/imports/api/appState.js';
 

// Questions component - menu for questions features
class Questions extends Component {
  closeMenu(){
    AppState.set('features_show', 'none');
  }
  render() {
    const questions = classNames(
      'panel w3-card-4 w3-animate-right', {
      'w3-hide': !_.isEqual(this.props.features_show, 'questions'),
    });
    return (
      <div className={questions}>
        <header className="panel__header w3-container w3-teal">
          <a className="w3-teal w3-left-align" onClick={()=>this.closeMenu()}>
            <i className="fa-chevron-left fa fa-lg fa-fw w3-margin-right"/>
            Questions
          </a>
        </header>
        <main className="panel__content w3-container w3-text-teal">
          <p>What is WebMISTC?</p>
          <p>How do I add questions?</p>
          <p>How do I remove questions?</p>
        </main>
      </div>
    );
  }
}
 
 
Questions.propTypes = {
  features_show: PropTypes.string.isRequired,
};
 
export default createContainer(() => {
  return {
    features_show: AppState.get('features_show'),
  };
}, Questions);