import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import classNames from 'classnames';
import DummyText from '/imports/api/dummyText';
import { Chats } from '/imports/api/chats';
import AppState from '/imports/api/appState';
import _ from 'lodash';

// Chat component - menu for chat features
class Chat extends Component {
  constructor(props) {
    super(props);
    this.lastMessage;
    this.state = {
      message: '',
    };
  }
  componentDidMount() {
    if (this.lastMessage) {
      this.lastMessage.scrollIntoView();
    }
  }

  componentDidUpdate() {
    if (this.lastMessage) {
      this.lastMessage.scrollIntoView();
    }
  }
  closeMenu(){
    AppState.set('features_show', 'none');
  }
  handleInput(event){
    const message = event.target.value;
    this.setState({message});
  }
  handleSubmit(event){
    const enterKey = _.isEqual(event.key.toUpperCase(), 'ENTER');
    if(enterKey){
      event.preventDefault();
      Meteor.call('chats.insert',{
        username: this.props.username,
        text: this.state.message,
      })
      this.setState({message: ''});
    }
  }
  generateMessages(){
    const chats = this.props.chats;
    if(_.isEmpty(chats)) return;

    const soleMessage = _.isEqual(chats.length, 1);
    const rest = soleMessage ? chats : _.dropRight(chats);
    const last = _.last(chats);
    
    const messages = rest.map((message) => (
      <li key={message._id}>
        <p className="w3-slim w3-text-dark-grey"><b>{message.username}: </b>{message.text}</p>
      </li>
    ));

    if(!soleMessage){
      messages.push((
        <li key={last._id} ref={element => this.lastMessage = element}>
          <p className="w3-slim w3-text-dark-grey"><b>{last.username}: </b>{last.text}</p>
        </li>
      ));
    } 
    return messages;
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
            <i className="fa-trash fa fa-lg fa-fw w3-margin-left" onClick={(event)=>{
              event.stopPropagation();
              Meteor.call('chats.reset');
            }}/>
          </a>
        </header>
        <main className="panel__content w3-container">
          <ul className="w3-ul">
            {this.generateMessages()}
          </ul>
        </main>
        <footer className="panel__footer">
          <textarea className="w3-input w3-border" style={{resize:'none'}}
            onChange={event => this.handleInput(event)}
            onKeyPress={event => this.handleSubmit(event)}
            placeholder="Enter message..."
            value={this.state.message}
          />
        </footer>
      </div>
    );
  }
}
 
 
Chat.propTypes = {
  features_show: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
  chats: PropTypes.arrayOf(PropTypes.object).isRequired,
};
 
export default createContainer(() => {
  Meteor.subscribe('chats');
  return {
    features_show: AppState.get('features_show'),
    username: AppState.get('user_name'),
    chats: Chats.find({}, { sort: { createdAt: 1 } }).fetch(),
  };
}, Chat);