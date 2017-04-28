import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import classNames from 'classnames';
import AppState from '/imports/api/appState.js';

// LineButton component - button for selecting the line note tool
class LineButton extends Component {
  render() {
    return (
      <span 
        className="menu__item flex-row" data-tip="Line" 
        onClick={()=>this.props.select('type', 'line')}
      >
        <span className="menu__item-button flex-row flex-row--center">
          <i className="fa-minus fa fa-lg fa-fw fa-rotate-315"/>
        </span>
        <span className="menu__item-description">
          Line
        </span>
      </span>
    );
  }
}
 
LineButton.propTypes = {
  select: PropTypes.func.isRequired,
};
 
export default createContainer(() => {
  return {

  };
}, LineButton);