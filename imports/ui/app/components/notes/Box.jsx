import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import classNames from 'classnames';
import AppState from '/imports/api/appState';
import Colors from '/imports/api/colors';
import Sizes from '/imports/api/sizes';

// Box component - box for the notes layer
class Box extends Component {
  handleErase(){
    const { _id, note_erasing } = this.props;
    if(note_erasing){
      Meteor.call('notes.remove', _id);
    }
  }
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
    return (
      <rect id={_id} x={origin.x} y={origin.y} width={dim.x} height={dim.y}
        strokeWidth={size} stroke={color} fill='none'
        onMouseOver={()=>this.handleErase()}/>
    );
  }
}
 
Box.propTypes = {
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
  }),};
 
export default createContainer(() => {
  return {
    note_erasing: AppState.get('note_erasing')
  };
}, Box);