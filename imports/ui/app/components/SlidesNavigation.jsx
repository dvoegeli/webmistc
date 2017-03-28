import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import classNames from 'classnames';
import Draggable from 'react-draggable';
import AppState from '/imports/api/appState.js';
import SlideThumbnail from './SlideThumbnail.jsx';
import { Slides } from '/imports/api/slides.js';

// SlidesNavigation component - slide-style navigation for slides
class SlidesNavigation extends Component {
  render() {
    const slideNav = classNames(
      'menu--slide-nav menu w3-animate-bottom', {
      'w3-show': this.props.slides_nav_open,
    });
    return (
      <nav className={slideNav}>
        <section className="slide-nav w3-border-left w3-border-right ">
          <Draggable axis="x" bounds={{top: 0, left: -1250, right: 0, bottom: 0}}>
            <div>
              <span className="slide-nav__slides flex-row">
                {this.props.slides.map((slide) => {
                  const {data, number, active, _id} = slide;
                  return <SlideThumbnail key={_id} slide={data} number={number} active={active}/>
                })}
              </span>
            </div>
          </Draggable>
        </section>
      </nav>
    );
  }
}
 
SlidesNavigation.propTypes = {
  slides_nav_open: PropTypes.bool.isRequired,
};
 
export default createContainer(() => {
  Meteor.subscribe('slides');
  return {
    slides_nav_open: AppState.get('slides_nav_open'),
    slides: _.sortBy(Slides.find({}).fetch(), ['number']),
  };
}, SlidesNavigation);