import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import classNames from 'classnames';
import AppState from '/imports/api/appState.js';
import Colors from '/imports/api/colors';
import Sizes from '/imports/api/sizes';

// Circle component - circle for the notes layer
class Circle extends Component {
  render() {
    const { _id } = this.props;
    const color = Colors.getHex(this.props.color);
    const size = Sizes.get(this.props.size);
    const coords = this.props.data.coords;
    const x1 = coords[0].x;
    const y1 = coords[0].y;
    const x2 = coords[1].x;
    const y2 = coords[1].y;
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
    const center = {
      x: origin.x+(dim.x/2 || 0), 
      y: origin.y+(dim.y/2 || 0),
    };
    const radius = {
      x: dim.x/2 || 0,
      y: dim.y/2 || 0,
    }

    return (
      <ellipse id={_id} cx={center.x} cy={center.y} rx={radius.x} ry={radius.y}
        strokeWidth={size} stroke={color} fill='none'/>
    );
  }
}
 
Circle.propTypes = {
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
}, Circle);