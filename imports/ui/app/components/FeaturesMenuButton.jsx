import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import classNames from 'classnames';
import AppState from '/imports/api/appState.js';

// FeaturesMenuButton component - button for features menu
class FeaturesMenuButton extends Component {
  toggleFeaturesMenu(){
    AppState.set('features_menu_open', !this.props.features_menu_open);
  }

  render() {
    const button = classNames(
      'panels-menu-btn ripple',
      'w3-btn w3-btn-floating-large',
      'w3-card-2 w3-teal w3-text-white',
      'w3-hide-large'
    );
    return (
      <button className={button} onClick={()=>this.toggleFeaturesMenu()}>
        <i className="fa-th-list fa fa-fw"/>
      </button>
    );
  }
}

FeaturesMenuButton.propTypes = {
  features_menu_open: PropTypes.bool.isRequired,
};
 
export default createContainer(() => {
  return {
    features_menu_open: AppState.get('features_menu_open'),
  };
}, FeaturesMenuButton);