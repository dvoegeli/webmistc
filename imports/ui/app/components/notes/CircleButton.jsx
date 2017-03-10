import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import classNames from 'classnames';
import AppState from '../../../../api/appState.js';

// CircleButton component - button for selecting the circle note tool
class CircleButton extends Component {
  render() {
    return (
      <span 
        className="menu__item flex-row" data-tip="Circle" 
        onClick={()=>this.props.select('type', 'circle')}
      >
        <span className="menu__item-button flex-row flex-row--center">
          <i className="fa-circle-thin fa fa-lg fa-fw"/>
        </span>
        <span className="menu__item-description">
          Circle
        </span>
      </span>
    );
  }
}
 
CircleButton.propTypes = {
  select: PropTypes.func.isRequired,
};
 
export default createContainer(() => {
  return {

  };
}, CircleButton);