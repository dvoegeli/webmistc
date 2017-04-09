import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import classNames from 'classnames';
import AppState from '/imports/api/appState.js';
import Colors from '/imports/api/colors';
import Sizes from '/imports/api/sizes';

// Arrow component - arrow for the notes layer
class Arrow extends Component {
  render() {
    const { _id } = this.props;
    const color = Colors.getHex(this.props.color);
    const size = Sizes.get(this.props.size);
    const coords = this.props.data.coords;
    const x1 = coords[0].x;
    const y1 = coords[0].y;
    const x2 = coords[1].x;
    const y2 = coords[1].y;
    const arrowHead = `arrow-head-${_id}`;
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
      coords: PropTypes.arrayOf(
        PropTypes.shape({
          x: PropTypes.number.isRequired,
          y: PropTypes.number.isRequired,
        })
      ),
    }),
    size: PropTypes.string.isRequired,
    color: PropTypes.string.isRequired,
  }),
};
 
export default createContainer(() => {
  return {};
}, Arrow);