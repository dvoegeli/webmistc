import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import classNames from 'classnames';
import DummyText from '/imports/api/dummyText.js';
import AppState from '/imports/api/appState.js';

// Message component - menu for message features
class Message extends Component {
  closeMenu(){
    AppState.set('features_show', 'none');
  }
  toggleMessageRecipients(){
    AppState.set('messages_list_open', !this.props.messages_list_open);
  }
  changeRecipient(recipient){
    AppState.set({
      'messages_recipient': recipient,
      'messages_list_open': !this.props.messages_list_open
    });
  }

  render() {
    const message = classNames(
      'panel w3-card-4 w3-animate-right', {
      'w3-hide': !_.isEqual(this.props.features_show, 'message')
    });
    const messages = {
      list: classNames(
        '.messages__recipient-list w3-text-teal w3-dropdown-content w3-card-4', {
        'w3-show': this.props.messages_list_open,
      }),
    }
    return (
      <div className={message}>
        <header className="panel__header w3-container w3-teal">
          <div className="flex-row flex-row--center">
            <a className="w3-teal" onClick={()=>this.closeMenu()}>
              <i className="fa-chevron-left fa fa-lg fa-fw w3-margin-right"/>
            </a>
            <div className="w3-dropdown-click">
              <button className="w3-btn w3-btn-block w3-cyan w3-text-white" onClick={()=>this.toggleMessageRecipients()} >
                {this.props.messages_recipient === 'none' ? 'Recipients' : this.props.messages_recipient}
                <i className="fa-caret-down fa fa-lg fa-fw"/>
              </button>
              <div className={messages.list}>
                <a className="w3-padding-medium" onClick={()=>this.changeRecipient('dorian')} href="#">Dorian</a>
                <a className="w3-padding-medium" onClick={()=>this.changeRecipient('professor')} href="#">Professor</a>
                <a className="w3-padding-medium" onClick={()=>this.changeRecipient('student')} href="#">Student</a>
              </div>
            </div>
          </div>
          
        </header>
        <main className="panel__content w3-container">
          {this.props.messages_recipient === 'dorian' ? 
            <ul className="w3-ul">
              <li>
                <p className="w3-slim w3-text-dark-grey"><b>self: </b>Hi, Dorian!</p>
              </li>
            </ul>
          : ""}
          {this.props.messages_recipient === 'professor' ? 
            <ul className="w3-ul">
              <li>
                <p className="w3-slim w3-text-dark-grey"><b>dorian: </b>Hi, Professor!</p>
              </li>
              <li>
                <p className="w3-slim w3-text-dark-grey"><b>professor: </b>Hi, Dorian!</p>
              </li>
            </ul>
          : ""}
          {this.props.messages_recipient === 'student' ? 
            <ul className="w3-ul">
              <li>
                <p className="w3-slim w3-text-dark-grey"><b>dorian: </b>Hi, Student!</p>
              </li>
              <li>
                <p className="w3-slim w3-text-dark-grey"><b>student: </b>Hi, Dorian!</p>
              </li>
            </ul>
          : ""}
        </main>
        <footer className="panel__footer">
          <textarea className="w3-input w3-border" placeholder="Enter message..." style={{resize:'none'}}></textarea>
        </footer>
      </div>
    );
  }
}
 
 
Message.propTypes = {
  features_show: PropTypes.string.isRequired,
  messages_list_open: PropTypes.bool.isRequired,
  messages_recipient: PropTypes.string.isRequired,
};
 
export default createContainer(() => {
  return {
    features_show: AppState.get('features_show'),
    messages_recipient: AppState.get('messages_recipient'),
    messages_list_open: AppState.get('messages_list_open'),
  };
}, Message);