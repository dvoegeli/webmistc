import React, { Component } from 'react';

export default class NotFound extends Component {
  render() {
    return (
      <div id="not-found">
        <div className="not-found-image">
          <img src="/img/404.svg" alt="" />
        </div>
        <div className="not-found-title">
          <h1>Sorry, that page doesn't exist</h1>
          <a href="/" className="gotohomepage">Go to home</a>
        </div>
      </div>
    );
  }
}