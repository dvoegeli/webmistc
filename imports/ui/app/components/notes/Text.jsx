import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import classNames from 'classnames';
import _ from 'lodash';
import d3 from 'd3';
import AppState from '/imports/api/appState';
import Colors from '/imports/api/colors';
import Sizes from '/imports/api/sizes';

// Text component - text for the notes layer
class Text extends Component {
  handleEdit(event) {
    event.stopPropagation();
    const text = $(this.textInput).text();
    const width = Math.min(text.length+1, 50);
    $(this.textInput).css('width', `${width}ch`);
  }
  handleDoneEditing(event) {
    event.stopPropagation();
    if(event.type === 'onBlur' || event.charCode == 13){
      event.preventDefault();
      event.target.blur();  
      const { _id, data, size, color, type } = this.props;
      data.text = $(this.textInput).text();
      const note = { _id, type, data, color, size };
      Meteor.call(`${note.type}.update`, note, /*handleStickyNote*/);
    }
  }
  render() {
    const { _id } = this.props;
    const color = Colors.getHex(this.props.color);
    const size = Sizes.getText(this.props.size);
    const { coords } = this.props.data;
    const text = this.props.data.text || "Enter text";
    const { x, y } = this.props.data.coords[1];
    const width = Math.min(text.length+1, 50);
    const textStyle = {
      fontFamily: 'monospace',
      fontSize: size,
      backgroundColor: 'rgba(220,220,220,0.95)',
      color,
      padding: '0 0.5ch',
      cursor: 'text',
      textAlign: 'left',
      userSelect: 'none',
      width: `${width}ch`,
    }
    return (
      <foreignObject id={_id} x={x} y={y}
        onMouseDown={(event)=>event.stopPropagation()}
        onMouseMove={(event)=>event.stopPropagation()}
        onMouseUp={(event)=>event.stopPropagation()}
      >
        <div style={textStyle}
          onInput={(event)=>this.handleEdit(event)} 
          onBlur={(event)=>this.handleDoneEditing(event)}
          onKeyPress={(event)=>this.handleDoneEditing(event)}
          ref={(input) => { this.textInput = input; }}
          contentEditable
          dangerouslySetInnerHTML={{ __html: _.escape(text)}}
        />
      </foreignObject>
    );
  }
}

Text.propTypes = {
  note: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    data: PropTypes.shape({
      coords: PropTypes.arrayOf(
        PropTypes.shape({
          x: PropTypes.number.isRequired,
          y: PropTypes.number.isRequired,
        })
      ),
      text: PropTypes.string,
    }),
    size: PropTypes.string.isRequired,
    color: PropTypes.string.isRequired,
  }),
};

export default createContainer(() => {
  return {};
}, Text);
