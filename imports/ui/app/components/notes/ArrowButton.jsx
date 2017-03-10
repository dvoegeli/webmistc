import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import classNames from 'classnames';
import AppState from '../../../../api/appState.js';

// ArrowButton component - button for selecting the arrow note tool
class ArrowButton extends Component {
  render() {
    return (
      <span 
        className="menu__item flex-row" data-tip="Arrow" 
        onClick={()=>this.props.select('type', 'arrow')}
      >
        <span className="menu__item-button flex-row flex-row--center">
          <i className="fa-long-arrow-right fa fa-lg fa-fw fa-rotate-315"/>
        </span>
        <span className="menu__item-description">
          Arrow
        </span>
      </span>
    );
  }
}
 
ArrowButton.propTypes = {
  select: PropTypes.func.isRequired,
};
 
export default createContainer(() => {
  return {

  };
}, ArrowButton);