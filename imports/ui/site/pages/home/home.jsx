import React, { Component } from 'react';
import AppState from '/imports/api/appState.js';
import { browserHistory } from 'react-router';
import classNames from 'classnames';
import _ from 'lodash';

export default class Home extends Component {
  constructor(props){
    super(props);
    this.input;
    this.maxInputLength = 20;
    this.state = {
      username: '',
      badInput: true,
      inputLength: `0/${this.maxInputLength}`,
    };
  }
  componentDidMount() {
    this.input.focus();
  }
  goodUsername(username){
    // allowed characters: A-Z, a-z, 0-9, _
    return /^\w+$/.test(username);
  }
  goodInputLength(length){
    return _.inRange(length, 1, this.maxInputLength + 1);
  }
  handleSubmit(event){
    event.preventDefault();
    
    const {username, badInput} = this.state;
    if(badInput) return;
    AppState.set('user_name', username);
    browserHistory.push('/app');
  }
  handleChange(event){
    const username = event.target.value;
    const inputLength = username.length + `/${this.maxInputLength}`;
    this.setState({ 
      badInput: !this.goodInputLength(username.length) || !this.goodUsername(username),
      inputLength, username,
    });
  }
  render() {
    const {username, badInput} = this.state;
    const inputElement = classNames(
      'w3-input', {
      'w3-bottombar w3-border-pink': badInput,
    });
    const usernameInput = classNames({
      'Allowed characters: A-Z, a-z, 0-9, _': !this.goodUsername(username),
    });
    const usernameLength = classNames(
      'w3-small', {
      'w3-text-light-gray': this.goodInputLength(username.length),
      'w3-text-pale-red': !this.goodInputLength(username.length),
    });
    return (
      <div className='flex-absolute-center w3-light-gray' style={{height: '100vh'}}>
      <span className='flex-column'>
        <img src='/img/logo.svg' alt='Logo' 
          className='w3-image w3-margin-bottom' style={{width: '50vw'}}
        />
        <form className='w3-container w3-card-4 w3-teal' style={{width: '50vw'}}
          onSubmit={event=>this.handleSubmit(event)}
        >
          
          <p>Enter your username</p>
          <p>      
            <input className={inputElement} name='username' type='text'
              ref={ input => this.input = input}
              onChange={(event)=>this.handleChange(event)}
            />
            <span className={usernameLength}>{this.state.inputLength}</span>
            <span className='w3-margin-left w3-text-pale-red w3-small'>{usernameInput}</span>
          </p>
          <p>      
            <button className='w3-btn w3-cyan w3-text-white w3-ripple'>Login</button>
          </p>
        </form>

      </span>
      </div>
    );
  }
}
