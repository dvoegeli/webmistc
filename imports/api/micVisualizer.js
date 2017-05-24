import _ from 'lodash';

let micSource;
let canvas;
let canvas_context;
let max_level = 0;
let old_level = 0;
const audioContext = new AudioContext();
const scriptNode = audioContext.createScriptProcessor(1024, 1, 1);

scriptNode.onaudioprocess = function(event) {
  let input = event.inputBuffer.getChannelData(0);
  let sum = _.sumBy(input, n => n*n );
  let instant = Math.sqrt(sum / input.length);
  max_level = Math.max(max_level, instant);
  instant = Math.max(instant, old_level - 0.0075);
  old_level = instant;
  canvas_context.clearRect(0, 0, canvas.width, canvas.height);
  canvas_context.fillStyle = '#4caf50';
  canvas_context.fillRect(0, 0, (canvas.width) * (instant / max_level), (canvas.height));
}

export default MicVisualizer = {};

MicVisualizer.start = () => {
  if (!micSource || !canvas) return;
  micSource.connect(scriptNode);
  scriptNode.connect(audioContext.destination);
}
MicVisualizer.stop = () => {
  if (!micSource || !canvas) return;
  try{
    micSource.disconnect(scriptNode);
    scriptNode.disconnect(audioContext.destination);
  }catch(e){
    // microphone was never connected
  }
}
MicVisualizer.micSource = audioStream => {
  micSource = audioContext.createMediaStreamSource(audioStream)

};
MicVisualizer.canvas = domElement => {
  canvas = domElement;
  canvas_context = canvas.getContext('2d')
};