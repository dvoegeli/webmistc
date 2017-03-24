import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import classNames from 'classnames';
import AppState from '/imports/api/appState.js';

// SlidesImport component - button for features menu
class SlidesImport extends Component {

  componentDidMount(){
    console.log(this.slideInput)
  }

  render() {

    return (
      <a className="flex-row w3-padding-0 w3-section w3-text-teal">
        <label>
          <input 
            className="import-button" 
            type="file" 
            accept=".pdf,.jpg,.png," 
            style={{display: "none"}}
            ref={input => this.slideInput = input} 
          />
          <i className="fa-sign-in fa fa-lg fa-fw w3-margin-right"/>
          Import Slides
        </label>
        <canvas className="import-canvas" style={{display: "none"}}></canvas>
      </a>
    );
  }
}

SlidesImport.propTypes = {
  /*features_menu_open: PropTypes.bool.isRequired,*/
};
 
export default createContainer(() => {
  return {
    /*features_menu_open: AppState.get('features_menu_open'),*/
  };
}, SlidesImport);