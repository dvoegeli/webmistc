import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import classNames from 'classnames';
 
import AppState from '/imports/api/appState.js';
 

// Slides component - menu for slides features
class Slides extends Component {
  closeMenu(){
    AppState.set('features_show', 'none');
  }

  render() {
    const slides = classNames(
      'panel w3-card-4 w3-animate-right', {
      'w3-hide': !_.isEqual(this.props.features_show, 'slides'),
    });
    return (
      <div className={slides}>
        <header className="panel__header w3-container w3-teal">
          <a className="w3-teal w3-left-align" onClick={()=>this.closeMenu()}>
            <i className="fa-chevron-left fa fa-lg fa-fw w3-margin-right"/>
            Import/Export
          </a>
        </header>
        <main className="panel__content w3-container">
          <ul className="w3-ul">
            <li>
              <a className="flex-row w3-padding-0 w3-section w3-text-teal">
                <label>
                  <input type="file" accept=".pdf,.jpg,.png," style={{display: "none"}}/>
                  <i className="fa-sign-in fa fa-lg fa-fw w3-margin-right"/>Import Slides
                </label>
              </a>
            </li>
            <li>
              <a className="flex-row w3-padding-0 w3-section w3-text-teal" href="#!">
                <i className="fa-sign-out fa fa-lg fa-fw w3-margin-right"/>
                Export Slides
              </a>
            </li>
            <li>
              <a className="flex-row w3-padding-0 w3-section w3-text-teal" href="#!">
                <i className="fa-file-o fa fa-lg fa-fw w3-margin-right"/>
                Insert Blank Slide
              </a>
            </li>
          </ul>
        </main>
      </div>
    );
  }
}
 
 
Slides.propTypes = {
  features_show: PropTypes.string.isRequired,
};
 
export default createContainer(() => {
  return {
    features_show: AppState.get('features_show'),
  };
}, Slides);