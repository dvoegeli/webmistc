import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import classNames from 'classnames';
import AppState from '/imports/api/appState.js';

// Box component - box for the notes layer
class Box extends Component {
  render() {
    const {_id,x1,y1,x2,y2,size,color} = this.props;
    const origin = {
      x: (x2 >= x1) ? x1 : x2, 
      y: (y2 >= y1) ? y1 : y2,
    };
    const end = {
      x: (x2 >= x1) ? x2 : x1, 
      y: (y2 >= y1) ? y2 : y1,
    };
    const dim = {
      x: (x2 >= x1) ? (x2-x1) : (x1-x2),
      y: (y2 >= y1) ? (y2-y1) : (y1-y2),
    }

    return (
      <rect id={_id} x={origin.x} y={origin.y} width={dim.x} height={dim.y}
        strokeWidth={size} stroke={color} fill='none'/>
    );
  }
}
 
Box.propTypes = {
  note: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    x1: PropTypes.number.isRequired,
    y1: PropTypes.number.isRequired,
    x2: PropTypes.number.isRequired,
    y2: PropTypes.number.isRequired,
    size: PropTypes.string.isRequired,
    color: PropTypes.string.isRequired,
  }),
};
 
export default createContainer(() => {
  return {};
}, Box);