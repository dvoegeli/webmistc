import { Meteor } from 'meteor/meteor';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

import { Slides } from './slides.js';
import { AudioConference } from './audioConference.js';

export default Presentation = {};

// Returns a promise
// Use .then(()=>{...}) to use the promise
Presentation.save = () => {
  Meteor.call('recordings.fetch', (error, recordings) => {
    if (error) {}
    const zip = new JSZip();
    zip.file('state.json', JSON.stringify(recordings));
    zip.file('slides.json', JSON.stringify(Slides.collection()));
    // zip.file('audio.opus', AudioConference.audio());
    zip.generateAsync({ type: 'blob' }).then(function(blob) {
      saveAs(blob, 'presentation.mstc');
    });
  });
}
Presentation.load = () => {
  // require("fs").readFile("hello.zip", function (err, data) {
  //   if (err) throw err;
  //   var zip = new JSZip();
  //   zip.loadAsync(data);
  // }
}