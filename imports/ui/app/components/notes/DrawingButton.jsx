import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import classNames from 'classnames';
import AppState from '/imports/api/appState.js';
 
// DrawingButton component - button for selecting the draw note tool
class DrawingButton extends Component {
  render() {
    return (
      <span className="menu__item flex-row" data-tip="Draw">
        <span 
          className="menu__item-button flex-row flex-row--center" 
          onClick={()=>this.props.select('type', 'drawing')}
        >
          <i className="fa-pencil fa fa-lg fa-fw"/>
        </span>
        <span className="menu__item-description">
          Draw
        </span>
      </span>
    );
  }
}
 
DrawingButton.propTypes = {
  select: PropTypes.func.isRequired,
};
 
export default createContainer(() => {
  return {

  };
}, DrawingButton);