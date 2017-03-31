import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import classNames from 'classnames';
import AppState from '/imports/api/appState.js';

// TextButton component - button for selecting the text note tool
class TextButton extends Component {
  render() {
    return (
      <span className="menu__item flex-row" data-tip="Text">
        <span 
          className="menu__item-button flex-row flex-row--center" 
          onClick={()=>this.props.select('type', 'text')}
        >
          <i className="fa-comment-o fa fa-lg fa-fw"/>
        </span>
        <span className="menu__item-description">
          Text
        </span>
      </span>
    );
  }
}
 
TextButton.propTypes = {
  select: PropTypes.func.isRequired,
};
 
export default createContainer(() => {
  return {

  };
}, TextButton);