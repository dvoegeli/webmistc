import React, { Component, PropTypes } from 'react';
import _ from 'lodash';
import { createContainer } from 'meteor/react-meteor-data';
import classNames from 'classnames';
import AppState from '/imports/api/appState.js';

// FeatureButton component - button to open a feature menu
class FeatureButton extends Component {
  showFeature(feature) {
    AppState.set('features_show', feature);
  }
  render() {
    const button = 'menu__item w3-margin-left w3-left-align w3-white w3-text-teal';
    const {label, iconClass} = this.props;
    const icon = classNames(
      'fa fa-lg fa-fw w3-margin-right',
      iconClass,
    )
    return (
      <span className={button} onClick={() => this.showFeature(_.lowerCase(label))}>
        <i className={icon}/>{_.capitalize(label)}
      </span>
    );
  }
}

FeatureButton.propTypes = {
  label: PropTypes.string.isRequired,
  iconClass: PropTypes.string.isRequired,
};
 
export default createContainer(() => {
  return {

  };
}, FeatureButton);