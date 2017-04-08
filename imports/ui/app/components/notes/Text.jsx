import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import classNames from 'classnames';
import _ from 'lodash';
import AppState from '/imports/api/appState';
import Colors from '/imports/api/colors';
import Sizes from '/imports/api/sizes';

// Text component - text for the notes layer
class Text extends Component {
  handleEdit(event) {
    event.stopPropagation();
    const data = AppState.get('note_data');
    data.text = $(this.textInput).text();
    AppState.set('note_data', data);
  }
  handleDoneEditing(event) {
    event.stopPropagation();
    if(event.type === 'onBlur' || event.charCode == 13){
      event.preventDefault();
      console.log('submit data;lkjdf laksdfh lksjdfh ');
      event.target.blur();  
      const { _id, data, size, color, type } = this.props;
      console.log(this.props)
      data.text = $(this.textInput).text();
      const note = { _id, type, data, color, size };
      Meteor.call(`${note.type}.update`, note, /*handleStickyNote*/);
    }
  }
  render() {
    const { _id, size, color } = this.props;
    const { coords, text } = this.props.data;
    const { x, y } = this.props.data.coords[1];
    const textStyle = {
      fontFamily: 'monospace',
      fontSize: (size * 3),
      backgroundColor: 'rgba(220,220,220,0.95)',
      color,
      padding: 5,
      cursor: 'text',
      textAlign: 'left',
      userSelect: 'none',
    }
    const width = text ? ((size * 3) * text.length) : 100;
    return (
      <foreignObject id={_id} x={x} y={y} width={width}
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
          dangerouslySetInnerHTML={{ __html: text || 'Enter text' }}
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
