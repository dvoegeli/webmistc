import { Meteor } from 'meteor/meteor';
import React, { Component, PropTypes } from 'react';
import _ from 'lodash';
import { createContainer } from 'meteor/react-meteor-data';
import classNames from 'classnames';
import AppState from '/imports/api/appState.js';
import { Slides } from '/imports/api/slides.js';

// SlidesImport component - button to import slides to database
class SlidesImport extends Component {
  constructor() {
    super()
    this.parseImport = this.parseImport.bind(this);
  }
  componentDidMount() {
    PDFJS.workerSrc = '/packages/pascoual_pdfjs/build/pdf.worker.js';
  }
  storePdfSlides(slides) {
    slides.forEach((slide) => {
      // const canvas = this.canvas;
      const canvas = document.createElement('canvas');
      const scale = 1.5;
      const viewport = slide.getViewport(scale);
      const context = canvas.getContext('2d');
      canvas.height = viewport.height;
      canvas.width = viewport.width;
      const task = slide.render({ canvasContext: context, viewport: viewport });
      task.promise.then(function() {
        const slideData = canvas.toDataURL('image/png');
        Meteor.call('slides.insert', slideData);
      });
    });

  }
  parsePdf(pdf) {
    const slides = [];
    _.times(pdf.numPages, (pageNum) => {
      // pageNum needs to start at 1
      pageNum += 1;
      slides.push(pdf.getPage(pageNum));
    });
    Promise.all(slides).then((slides) => this.storePdfSlides(slides));
  }
  parseImport(event) {
    const slides = event.target.files[0];
    // check if image or pdf, assume pdf for now
    const slidesUrl = URL.createObjectURL(slides);
    PDFJS.getDocument(slidesUrl).then(this.parsePdf.bind(this), (error) => console.log(error));
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
            onChange={this.parseImport}
          />
          <i className="fa-sign-in fa fa-lg fa-fw w3-margin-right"/>
          Import Slides
        </label>
      </a>
    );
  }
}
/*style={{display: "none"}}*/
SlidesImport.propTypes = {
};

export default createContainer(() => {
  return {
  };
}, SlidesImport);
