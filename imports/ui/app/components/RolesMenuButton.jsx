import React, { Component, PropTypes } from 'react';
import _ from 'lodash';
import { createContainer } from 'meteor/react-meteor-data';
import classNames from 'classnames';
import AppState from '/imports/api/appState.js';
 

// RolesMenuButton component - button for opening the user role options menu
class RolesMenuButton extends Component {
  toggleOptionsMenu(){
    AppState.set('roles_menu_open', !this.props.roles_menu_open);
  }
  changeRole(role){
    AppState.set({
      'user_role': role,
      'roles_menu_open': !this.props.roles_menu_open,
    });

  }
  render() {
    const {user_role, roles_menu_open} = this.props;
    const button = classNames(
      'menu__item flex-row', {
      'w3-text-deep-orange': _.isEqual(user_role, 'attendee'),
      'w3-text-green': _.isEqual(user_role, 'contributor'),
      'w3-text-blue': _.isEqual(user_role, 'presenter'),
      'w3-text-pink': _.isEqual(user_role, 'host'),
    }); 
    const options = classNames(
      'menu__item-dropdown--roles w3-dropdown-content w3-white w3-card-4', {
      'w3-show': roles_menu_open,
    });
    const attendee = 'w3-pale-orange w3-padding-medium w3-text-dark-grey';
    const contributor = 'w3-pale-green w3-padding-medium w3-text-dark-grey';
    const presenter = 'w3-pale-blue w3-padding-medium w3-text-dark-grey ';
    const host = 'w3-pale-red w3-padding-medium w3-text-dark-grey';
    const role = _.capitalize(user_role);
    return (
      <span className='roles-menu w3-dropdown-click' data-tip={role}>
        <span className={button} onClick={()=>this.toggleOptionsMenu()}>
          <span className="menu__item-button flex-row flex-row--center">
            <i className="fa-user fa fa-lg fa-fw"/>
          </span>
          <span className="menu__item-description">{role}</span>
        </span>
        <div className={options}>
          <a className={attendee} onClick={()=>this.changeRole('attendee')} href='#'>Attendee</a>
          <a className={contributor} onClick={()=>this.changeRole('contributor')} href='#'>Contributor</a>
          <a className={presenter} onClick={()=>this.changeRole('presenter')} href='#'>Presenter</a>
          <a className={host} onClick={()=>this.changeRole('host')} href='#'>Host</a>
        </div>
      </span>
    );
  }
}
 
 
RolesMenuButton.propTypes = {
  roles_menu_open: PropTypes.bool.isRequired,
  user_role: PropTypes.string.isRequired,
};
 
export default createContainer(() => {
  return {
    roles_menu_open: AppState.get('roles_menu_open'),
    user_role: AppState.get('user_role'),
  };
}, RolesMenuButton);