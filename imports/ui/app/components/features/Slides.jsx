import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import classNames from 'classnames';
 
import AppState from '/imports/api/appState.js';
import SlidesAppend from './Slides/SlidesAppend.jsx';
import SlidesInsert from './Slides/SlidesInsert.jsx';
import SlidesReset from './Slides/SlidesReset.jsx';
import SlidesBlank from './Slides/SlidesBlank.jsx';
import SlidesDelete from './Slides/SlidesDelete.jsx';
 

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
            Slides
          </a>
        </header>
        <main className="panel__content w3-container">
          <ul className="w3-ul">
            <li>
              <SlidesAppend/>
            </li>
            <li>
              <SlidesInsert/>
            </li>
            <li>
              <SlidesReset/>
            </li>
            <li>
              <SlidesDelete/>
            </li>
            <li>
              <SlidesBlank/>
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