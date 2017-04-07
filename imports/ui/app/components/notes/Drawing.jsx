import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import classNames from 'classnames';
import d3 from 'd3';
import AppState from '/imports/api/appState.js';

// Drawing component - drawing for the notes layer
class Drawing extends Component {
  render() {
    const { _id, size, color } = this.props;
    const coords = this.props.data.coords;
    const line = d3.line()
      .curve(d3.curveCardinal)
      .x(function(coord) { return coord.x; })
      .y(function(coord) { return coord.y; })
      (coords)
    const truncatedLine = line.replace(/(\.\d).*?(,)/g, '$1$2');
    return (
      <path id={_id} d={truncatedLine}
      strokeWidth={size} stroke={color} fill='none'/>
    );
  }
}

Drawing.propTypes = {
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
}, Drawing);