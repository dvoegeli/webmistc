import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import classNames from 'classnames';
import DummyText from '/imports/api/dummyText.js';
import AppState from '/imports/api/appState.js';

// Roles component - menu for roles features
class Roles extends Component {
  closeMenu(){
    AppState.set('features_show', 'none');
  }
  sortRolesBy(role){
    _.merge(this.state.roles.sortBy,
      { 
        attendee: false, 
        contributor: false,
        presenter: false,
        admin: false,
      },
      { [role]: true }
    );
    this.setState(this.state);
  }

  render() {
    const roles = classNames(
      'panel w3-card-4 w3-animate-right', {
      'w3-hide': !_.isEqual(this.props.features_show, 'roles'),
    });
    const roleControl = {
      sortBy: {
        attendee: classNames({
          'w3-show': this.state.roles.sortBy.attendee,
          'w3-hide': !this.state.roles.sortBy.attendee,
        }),
        contributor: classNames({
          'w3-show': this.state.roles.sortBy.contributor,
          'w3-hide': !this.state.roles.sortBy.contributor,
        }),
        presenter: classNames({
          'w3-show': this.state.roles.sortBy.presenter,
          'w3-hide': !this.state.roles.sortBy.presenter,
        }),
        admin: classNames({
          'w3-show': this.state.roles.sortBy.admin,
          'w3-hide': !this.state.roles.sortBy.admin,
        }),
      },
      tab: {
        attendee: classNames(
          'w3-btn w3-deep-orange', {
          'w3-opacity-max': !this.state.roles.sortBy.attendee,
        }),
        contributor: classNames(
          'w3-btn w3-green', {
          'w3-opacity-max': !this.state.roles.sortBy.contributor,
        }),
        presenter: classNames(
          'w3-btn w3-blue', {
          'w3-opacity-max': !this.state.roles.sortBy.presenter,
        }),
        admin: classNames(
          'w3-btn w3-pink', {
          'w3-opacity-max': !this.state.roles.sortBy.admin,
        }),
      }
    }
    return (
      <div className={roles}>
            <header className="panel__header w3-container w3-teal">
              <a className="w3-teal w3-left-align" onClick={this.togglePanel.bind(this, 'roles')}>
                <i className="fa-chevron-left fa fa-lg fa-fw w3-margin-right"/>
                Audience Roles
              </a>
            </header>
            <main className="panel__content">
              <div className="w3-btn-group">
                <button className={roleControl.tab.attendee} style={{width: 25 + '%'}} onClick={this.sortRolesBy.bind(this, 'attendee')}>
                  <i className="fa-user fa fa-fw fa-lg "/>
                </button>
                <button className={roleControl.tab.contributor} style={{width: 25 + '%'}} onClick={this.sortRolesBy.bind(this, 'contributor')}>
                  <i className="fa-user fa fa-fw fa-lg "/>
                </button>
                <button className={roleControl.tab.presenter} style={{width: 25 + '%'}} onClick={this.sortRolesBy.bind(this, 'presenter')}>
                  <i className="fa-user fa fa-fw fa-lg "/>
                </button>
                <button className={roleControl.tab.admin} style={{width: 25 + '%'}} onClick={this.sortRolesBy.bind(this, 'admin')}>
                  <i className="fa-user fa fa-fw fa-lg "/>
                </button>
              </div>
              <section className="w3-container">
                <div className={roleControl.sortBy.attendee}>
                  <h4 className="w3-text-teal">Sort By Attendee</h4>
                  <p className="w3-text-deep-orange">Student Ace</p>
                  <p className="w3-text-deep-orange">Student First</p>
                  <p className="w3-text-deep-orange">Student One</p>
                  <p className="w3-text-deep-orange">Student Prime</p>
                  <p className="w3-text-deep-orange">Student Solo</p>
                  <p className="w3-text-pink">Dorian</p>
                  <p className="w3-text-blue">Professor</p>
                  <p className="w3-text-green">Guest</p>
                </div>
                <div className={roleControl.sortBy.contributor}>
                  <h4 className="w3-text-teal">Sort By Contributor</h4>
                  <p className="w3-text-green">Guest</p>
                  <p className="w3-text-pink">Dorian</p>
                  <p className="w3-text-blue">Professor</p>
                  <p className="w3-text-deep-orange">Student Ace</p>
                  <p className="w3-text-deep-orange">Student First</p>
                  <p className="w3-text-deep-orange">Student One</p>
                  <p className="w3-text-deep-orange">Student Prime</p>
                  <p className="w3-text-deep-orange">Student Solo</p>
                </div>
                <div className={roleControl.sortBy.presenter}>
                  <h4 className="w3-text-teal">Sort By Presenter</h4>
                  <p className="w3-text-blue">Professor</p>
                  <p className="w3-text-pink">Dorian</p>
                  <p className="w3-text-green">Guest</p>
                  <p className="w3-text-deep-orange">Student Ace</p>
                  <p className="w3-text-deep-orange">Student First</p>
                  <p className="w3-text-deep-orange">Student One</p>
                  <p className="w3-text-deep-orange">Student Prime</p>
                  <p className="w3-text-deep-orange">Student Solo</p>
                </div>
                <div className={roleControl.sortBy.admin}>
                  <h4 className="w3-text-teal">Sort By Admin</h4>
                  <p className="w3-text-pink">Dorian</p>
                  <p className="w3-text-blue">Professor</p>
                  <p className="w3-text-green">Guest</p>
                  <p className="w3-text-deep-orange">Student Ace</p>
                  <p className="w3-text-deep-orange">Student First</p>
                  <p className="w3-text-deep-orange">Student One</p>
                  <p className="w3-text-deep-orange">Student Prime</p>
                  <p className="w3-text-deep-orange">Student Solo</p>
                </div>
              </section>
            </main>
          </div>
    );
  }
}
 
 
Roles.propTypes = {
  features_show: PropTypes.string.isRequired,
};
 
export default createContainer(() => {
  return {
    features_show: AppState.get('features_show'),
  };
}, Roles);