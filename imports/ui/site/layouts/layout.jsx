import { Component, PropTypes } from 'react';
 
export default class Layout extends Component {
  render() {
    return (
      <div class="container">
        {{this.props.page}}
      </div>
    );
  }
}

Layout.propTypes = {
  page: PropTypes.element.isRequired,
};