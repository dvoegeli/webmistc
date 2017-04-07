import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import classNames from 'classnames';
import d3 from 'd3';
import AppState from '/imports/api/appState.js';

// Drawing component - drawing for the notes layer
class Drawing extends Component {
  render() {
    const { _id, data, size, color } = this.props;
    const line = d3.line()
      .curve(d3.curveCardinal)
      .x(function(coord) { return Math.round(coord.x); })
      .y(function(coord) { return Math.round(coord.y); })
      (data)
    const denoisedLine = line.replace(/(\.\d).*?(,)/g, '$1$2');
    return (
      <path id={_id} d={denoisedLine}
      strokeWidth={size} stroke={color} fill='none'/>
    );
  }
}

Drawing.propTypes = {
  note: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    data: PropTypes.arrayOf(
      PropTypes.shape({
        x: PropTypes.number.isRequired,
        y: PropTypes.number.isRequired,
      })
    ),
    size: PropTypes.string.isRequired,
    color: PropTypes.string.isRequired,
  }),
};

export default createContainer(() => {
  return {};
}, Drawing);
