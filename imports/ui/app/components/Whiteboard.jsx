import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import classNames from 'classnames';
 
import AppState from '/imports/api/appState.js';

// Whiteboard component - represents the drawing area over the slides
class Whiteboard extends Component {
  generateToolCursor(color, type){
    // TODO extract colors into lib file for centralized reference
    const colors = {
      blue: '#2196f3',
      orange: '#ff9800',
      purple: '#9c27b0',
      red: '#f44336',
      green: '#4caf50'
    }
    const types = {
      draw: '<path d="M491 1536l91-91-235-235-91 91v107h128v128h107zm523-928q0-22-22-22-10 0-17 7l-542 542q-7 7-7 17 0 22 22 22 10 0 17-7l542-542q7-7 7-17zm-54-192l416 416-832 832h-416v-416zm683 96q0 53-37 90l-166 166-416-416 166-165q36-38 90-38 53 0 91 38l235 234q37 39 37 91z"/>',
      text: '<path d="M1792 896q0 174-120 321.5t-326 233-450 85.5q-70 0-145-8-198 175-460 242-49 14-114 22-17 2-30.5-9t-17.5-29v-1q-3-4-.5-12t2-10 4.5-9.5l6-9 7-8.5 8-9q7-8 31-34.5t34.5-38 31-39.5 32.5-51 27-59 26-76q-157-89-247.5-220t-90.5-281q0-130 71-248.5t191-204.5 286-136.5 348-50.5q244 0 450 85.5t326 233 120 321.5z"/>',
      circle: '<path d="M1664 896q0 209-103 385.5t-279.5 279.5-385.5 103-385.5-103-279.5-279.5-103-385.5 103-385.5 279.5-279.5 385.5-103 385.5 103 279.5 279.5 103 385.5z"/>',
      box: '<path d="M1664 416v960q0 119-84.5 203.5t-203.5 84.5h-960q-119 0-203.5-84.5t-84.5-203.5v-960q0-119 84.5-203.5t203.5-84.5h960q119 0 203.5 84.5t84.5 203.5z"/>',
      line: '<path transform="rotate(-45 902.250,901.969)" d="m1606.250453,805.969801l0,192q0,40 -28,68t-68,28l-1216,0q-40,0 -68,-28t-28,-68l0,-192q0,-40 28,-68t68,-28l1216,0q40,0 68,28t28,68z"/>',
      arrow: '<path transform="rotate(-45 864,895.930)" d="m1728,893q0,14 -10,24l-384,354q-16,14 -35,6q-19,-9 -19,-29l0,-224l-1248,0q-14,0 -23,-9t-9,-23l0,-192q0,-14 9,-23t23,-9l1248,0l0,-224q0,-21 19,-29t35,5l384,350q10,10 10,23z"/>',
      eraser: '<path fill="lightcoral" d="M832 1408l336-384h-768l-336 384h768zm1013-1077q15 34 9.5 71.5t-30.5 65.5l-896 1024q-38 44-96 44h-768q-38 0-69.5-20.5t-47.5-54.5q-15-34-9.5-71.5t30.5-65.5l896-1024q38-44 96-44h768q38 0 69.5 20.5t47.5 54.5z"/>',
    }
    
    return {
      cursor: `url('data:image/svg+xml,<svg fill="${colors[color]}" shape-rendering="auto" width="22" height="22" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg">${types[type]}</svg>'), auto`
    };
  }

  render() {
    const classes = classNames(
      'whiteboard w3-card-4 w3-light-grey', {
      'whiteboard--fullscreen': this.props.fullscreen,
    });
    const {note_color, note_type} = this.props;
    return (
      <main className={classes} style={this.generateToolCursor(note_color, note_type)}/>
    );
  }
}
 
 
Whiteboard.propTypes = {
  fullscreen: PropTypes.bool.isRequired,
  note_color: PropTypes.string.isRequired,
  note_type: PropTypes.string.isRequired,
};
 
export default createContainer(() => {
  return {
    fullscreen: AppState.get('whiteboard_fullscreen'),
    note_color: AppState.get('note_color'),
    note_type: AppState.get('note_type'),
  };
}, Whiteboard);