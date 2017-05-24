import 'rtcmulticonnection-v3/dist/RTCMultiConnection';
import io from 'socket.io-client';
// rtcmulticonnection w3 needs global access to Socket.io
// attach io to window
window.io = io;

// Hack https://github.com/socketio/socket.io-client/issues/961
import Response from 'meteor-node-stubs/node_modules/http-browserify/lib/response';
if (!Response.prototype.setEncoding) {
  Response.prototype.setEncoding = function(encoding) {
    // do nothing
  }
}

import _ from 'lodash';
import AppState from '/imports/api/appState.js';
import MicVisualizer from '/imports/api/micVisualizer.js';


const connection = new RTCMultiConnection();
const audioContext = new AudioContext();
const scriptNode = audioContext.createScriptProcessor(1024, 1, 1);
let audioStream;

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

connection.onstream = function(event) {
  console.log('connection is now streaming')
  audioStream = {
    local: event.mediaElement,
    remote: event.stream.getAudioTracks(),
  }
  MicVisualizer.micSource(event.stream);
  AudioConference.mute();
  AudioConference.volume(0.5);
}

export default AudioConference = {};

function extractLocalStreams(streamEvents){
  return _.filter(streamEvents,
    (stream) => _.isEqual(stream.type, 'local')
  );
}
AudioConference.connect = () => connection.openOrJoin('1f4b7ad5-5822-487a-bf02-3cb94cb961f3');
AudioConference.mute = () => {
  if (!audioStream) return;
  const events = connection.streamEvents;
  extractLocalStreams(events).forEach(event => event.stream.mute());
}
AudioConference.unmute = (volume) => {
  if (!audioStream) return;
  const events = connection.streamEvents;
  extractLocalStreams(events).forEach(event => event.stream.unmute());
}
AudioConference.volume = (volume) => {
  if (!audioStream.local) return;
  audioStream.local.volume = volume;
}