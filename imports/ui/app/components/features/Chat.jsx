import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import classNames from 'classnames';
import DummyText from '/imports/api/dummyText.js';
import AppState from '/imports/api/appState.js';

// Chat component - menu for chat features
class Chat extends Component {
  closeMenu(){
    AppState.set('features_show', 'none');
  }
  render() {
    const chat = classNames(
      'panel w3-card-4 w3-animate-right', {
      'w3-hide': !_.isEqual(this.props.features_show, 'chat')
    });
    return (
      <div className={chat}>
        <header className="panel__header w3-container w3-teal">
          <a className="w3-teal w3-left-align" onClick={()=> this.closeMenu()}>
            <i className="fa-chevron-left fa fa-lg fa-fw w3-margin-right"/>
            Group Chat
          </a>
        </header>
        <main className="panel__content w3-container">
          <ul className="w3-ul">
            <li>
              <p className="w3-slim w3-text-dark-grey"><b>dorian: </b>Hi, everyone!</p>
            </li>
            <li>
              <p className="w3-slim w3-text-dark-grey"><b>dorian: </b>Anyone here like Lorem Ipsum text?</p>
            </li>
            <li>
              <p className="w3-slim w3-text-dark-grey"><b>student: </b>Oh yeah!</p>
            </li>
            <li>
              <p className="w3-slim w3-text-dark-grey"><b>dorian: </b>{DummyText}</p>
            </li>
          </ul>
        </main>
        <footer className="panel__footer">
          <textarea className="w3-input w3-border" placeholder="Enter message..." style={{resize:'none'}}></textarea>
        </footer>
      </div>
    );
  }
}
 
 
Chat.propTypes = {
  features_show: PropTypes.string.isRequired,
};
 
export default createContainer(() => {
  return {
    features_show: AppState.get('features_show'),
  };
}, Chat);