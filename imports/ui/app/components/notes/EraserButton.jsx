import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import classNames from 'classnames';
import AppState from '../../../../api/appState.js';

// Eraser component - button for selecting the eraser tool
class Eraser extends Component {
  render() {
    return (
      <span 
        className="menu__item flex-row" data-tip="Eraser" 
        onClick={()=>this.props.select('type', 'eraser')}
      >
        <span className="menu__item-button flex-row flex-row--center">
          <i className="fa-eraser fa fa-fw fa-lg"/>
        </span>
        <span className="menu__item-description">
          Eraser
        </span>
      </span>
    );
  }
}
 
Eraser.propTypes = {
  select: PropTypes.func.isRequired,
};
 
export default createContainer(() => {
  return {

  };
}, Eraser);