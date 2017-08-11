import JSZip from 'jszip';
import { saveAs } from "file-saver";

export default Presentation = {};

// Returns a promise
// Use .then(()=>{...}) to use the promise
Presentation.save = () => {
  const zip = new JSZip();
  // compile recording here, i.e., state updates and audio
  zip.file("state.json", JSON.stringify({ buzz: 'ding' }));
  zip.generateAsync({ type: "blob" }).then(function(blob) {
    saveAs(blob, "presentation.mstc");
  });
}
Presentation.load = () => {
  // implement me
}