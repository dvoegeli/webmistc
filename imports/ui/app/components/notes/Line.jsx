import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import classNames from 'classnames';
import AppState from '/imports/api/appState.js';

// Line component - line for the notes layer
class Line extends Component {
  render() {
    const { _id, data, size, color } = this.props;
    const x1 = data.x1;
    const y1 = data.y1;
    const x2 = data.x2;
    const y2 = data.y2;
    return (
      <line id={_id} 
        x1={x1} y1={y1} 
        x2={x2} y2={y2}
        strokeWidth={size} stroke={color}
      />
    );
  }
}

Line.propTypes = {
  note: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    size: PropTypes.string.isRequired,
    color: PropTypes.string.isRequired,
    data: PropTypes.shape({
      x1: PropTypes.number.isRequired,
      y1: PropTypes.number.isRequired,
      x2: PropTypes.number.isRequired,
      y2: PropTypes.number.isRequired,
    }),
  }),
};

export default createContainer(() => {
  return {};
}, Line);
