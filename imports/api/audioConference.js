import 'rtcmulticonnection-v3/dist/RTCMultiConnection';
import io from 'socket.io-client';
// rtcmulticonnection w3 needs global access to Socket.io
// attach io to window
window.io = io;


import Response from 'meteor-node-stubs/node_modules/http-browserify/lib/response';
if (!Response.prototype.setEncoding) {
  Response.prototype.setEncoding = function(encoding) {
    // do nothing
    // Hack https://github.com/socketio/socket.io-client/issues/961
  }
}

import _ from 'lodash';
import AppState from '/imports/api/appState.js';
import MicVisualizer from '/imports/api/micVisualizer.js';
import { saveAs } from 'file-saver';

const connection = new RTCMultiConnection();
const context = new AudioContext();
const scriptNode = context.createScriptProcessor(1024, 1, 1);
let data;
let recorder;
const options = {mimeType: 'audio/webm;codecs=opus'};
let recording;


// use prototype STUN server until we host our own server
connection.socketURL = 'https://rtcmulticonnection.herokuapp.com:443/';

connection.session = {
  audio: true
};
connection.sdpConstraints.mandatory = {
  OfferToReceiveAudio: true,
  OfferToReceiveVideo: false
};
connection.mediaConstraints = {
  audio: true,
  video: false
};

connection.onstream = (event) => {
  data = {
    local: event.mediaElement,
    remote: event.stream.getAudioTracks(),
  }
  audioStream = event.stream;
  const isLocalStream = _.isEqual(event.type, 'local');
  if(isLocalStream){
    MicVisualizer.micSource(audioStream);
    AudioConference.mute();
    AudioConference.volume(0.5);
  }
  // TODO: method to add this stream's tracks to other stream's tracks
}

function handleStopRecording(event) {
  recording = event.data;
}

function extractStreams(streamEvents, type){
  if(!_.includes(['local', 'remote'],type.toLowerCase())) return;
  return _.filter(streamEvents,
    (stream) => _.isEqual(stream.type, type)
  );
}

function isTrackAvailable(){
  const tracks = audioStream.getAudioTracks();
  const isAvailable = _.some(tracks, track => track.enabled);
  return isAvailable;
}

export default AudioConference = {};

AudioConference.connect = () => connection.openOrJoin('1f4b7ad5-5822-487a-bf02-3cb94cb961f3');

AudioConference.mute = () => {
  if (!data) return;
  const events = connection.streamEvents;
  extractStreams(events, 'local').forEach(event => event.stream.mute());
}

AudioConference.unmute = (volume) => {
  if (!data) return;
  const events = connection.streamEvents;
  extractStreams(events, 'local').forEach(event => event.stream.unmute());
}

AudioConference.volume = (volume) => {
  if (!data.local) return;
  data.local.volume = volume;
}

AudioConference.startRecording = () => {
  recorder = new MediaRecorder(audioStream, options);
  recorder.ondataavailable = (event) => recording = event.data;
  if(!isTrackAvailable()) return;
  recorder.start();
}
AudioConference.stopRecording = () => {
  const isRecordingInactive = _.isEqual(recorder.state, 'inactive');
  if(isRecordingInactive) return;
  recorder.stop();
}

AudioConference.getRecording = () => {
  return recording;
}

// TODO: pause recording