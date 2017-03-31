import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import classNames from 'classnames';
import AppState from '/imports/api/appState.js';

// BoxButton component - button for selecting the box note tool
class BoxButton extends Component {
  render() {
    return (
      <span 
        className="menu__item flex-row" data-tip="Box" 
        onClick={()=>this.props.select('type', 'box')}
      >
        <span className="menu__item-button flex-row flex-row--center">
          <i className="fa-square-o fa fa-lg fa-fw"/>
        </span>
        <span className="menu__item-description">
          Box
        </span>
      </span>
    );
  }
}
 
BoxButton.propTypes = {
  select: PropTypes.func.isRequired,
};
 
export default createContainer(() => {
  return {

  };
}, BoxButton);