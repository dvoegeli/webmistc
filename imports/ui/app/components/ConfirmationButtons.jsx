import React, { Component, PropTypes } from 'react';

// ConfirmationButtons component - confirmation buttons
export default class ConfirmationButtons extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className="flex-row" style={{width: '100%', height: '100%' }}>
        <div 
          className="flex-row flex-row--center w3-pink" 
          style={{width: '100%', padding: '3px 0px' }}
          onClick={(event) => this.props.cancel(event)}
        >
          <i className="fa-times fa fa-fw w3-text-white"/>
        </div>
        <div 
          className="flex-row flex-row--center w3-green" 
          style={{width: '100%', padding: '3px 0px' }}
          onClick={(event) => this.props.execute(event)}
        >
          <i className="fa-check fa fa-fw w3-text-white"/>
        </div>
      </div>
    );
  }
}

ConfirmationButtons.propTypes = {
  cancel: PropTypes.func.isRequired,
  execute: PropTypes.func.isRequired,
};