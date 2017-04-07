import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import classNames from 'classnames';
import AppState from '/imports/api/appState.js';

// Arrow component - arrow for the notes layer
class Arrow extends Component {
  render() {
    const {_id,data,size,color} = this.props;
    const x1 = data.x1;
    const y1 = data.y1;
    const x2 = data.x2;
    const y2 = data.y2;
    const arrowHead = `arrow-head-${_id}`
    return (
      <g id={_id}>
        <marker 
          id={arrowHead} orient='auto' 
          markerWidth='2' markerHeight='4'
          refX='1' refY='2'
        >
          <path d={`M0,0 V4 L2,2 Z`} fill={color}/>
        </marker>
        <line
          x1={x1} y1={y1} x2={x2} y2={y2}
          markerEnd={`url(#${arrowHead})`}
          strokeWidth={size} stroke={color} 
        />
      </g>
    );
  }
}
Arrow.propTypes = {
  note: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    data: PropTypes.shape({
      x1: PropTypes.number.isRequired,
      y1: PropTypes.number.isRequired,
      x2: PropTypes.number.isRequired,
      y2: PropTypes.number.isRequired,
    }),
    size: PropTypes.string.isRequired,
    color: PropTypes.string.isRequired,
  }),
};
 
export default createContainer(() => {
  return {};
}, Arrow);