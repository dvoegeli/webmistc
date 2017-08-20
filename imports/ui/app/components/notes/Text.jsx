import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import classNames from 'classnames';
import _ from 'lodash';
import AppState from '/imports/api/appState';
import Colors from '/imports/api/colors';
import Sizes from '/imports/api/sizes';
import StickyNotes from '/imports/api/stickyNotes';

// TODO: refactor, comment
// TODO: soft returns, tabs, and reposition
// BUG: accidental select when placing notes
// BUG: incorrect preview when dragging during initial placement
// BUG: sticky notes should not remove last note until after text is submitted

// Text component - text for the notes layer
class Text extends Component {
  constructor(props){
    super(props);
    this.defaultText = 'Entering text...';
  }
  shouldComponentUpdate(nextProps){
    const { text } = this.props.data;
    const nextText = nextProps.data.text;
    return !_.isEqual(text, nextText);
  }
  handleErase(){
    const { _id, note_erasing } = this.props;
    if(note_erasing){
      Meteor.call('notes.remove', _id);
    }
  }
  handleEdit(event) {
    event.stopPropagation();
    const text = $(this.textInput).text();
    const width = Math.min(text.length+1, 50);
    $(this.textInput).css('width', `${width}ch`);
    AppState.set('note_sticky_next', '');
  }
  handleDoneEditing(event) {
    event.stopPropagation();
    event.preventDefault(); 
    const text = $(this.textInput).text();
    const { _id, data, size, color, type } = this.props;
    const note = { _id, type, data, color, size };
    const hasDefaultText = _.isEqual(text, this.defaultText);
    if(text && !hasDefaultText){
      data.text = text;
      Meteor.call(`${note.type}.update`, note, (error) => StickyNotes.handler(error, note._id))
    } else {
      Meteor.call('notes.remove', note._id);
    }
  }
  handleKeyPress(event) {
    event.stopPropagation();
    const isEnterPressed = _.isEqual(event.charCode, 13);
    if(isEnterPressed){
      event.preventDefault();
      event.target.blur();  
    }
  }
  componentDidMount(){
    const text = $(this.textInput).text();
    const hasDefaultText = _.isEqual(text, this.defaultText);
    if (hasDefaultText) {
      $(this.textInput).focus();
      document.execCommand('selectAll', false, null);
    }
  }
  componentDidUpdate(){
    const text = $(this.textInput).text();
    const hasText = !_.isEqual(text, this.defaultText);
    if (hasText) {
      document.getSelection().removeAllRanges();
      $(this.textInput).blur();
    }
  }
  render() {
    const { _id } = this.props;
    const color = Colors.getHex(this.props.color);
    const size = Sizes.getText(this.props.size);
    const { coords } = this.props.data;
    const text = this.props.data.text || this.defaultText;
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
        onMouseOver={()=>this.handleErase()}
      >
        <div style={textStyle}
          onInput={(event)=>this.handleEdit(event)} 
          onBlur={(event)=>this.handleDoneEditing(event)}
          onKeyPress={(event)=>this.handleKeyPress(event)}
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
  return {
    note_erasing: AppState.get('note_erasing')
  };
}, Text);
