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
let mediaElement;
const audioContext = new AudioContext();
const scriptNode = audioContext.createScriptProcessor(1024, 1, 1);
let micSource;

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
  mediaElement = event.mediaElement;
  MicVisualizer.micSource(event.stream);
}

export default AudioConference = {};

AudioConference.connect = () => connection.openOrJoin('1f4b7ad5-5822-487a-bf02-3cb94cb961f3');
AudioConference.mute = () => {
  if (!mediaElement) return;
  mediaElement.muted = true;
  mediaElement.volume = 0;
}
AudioConference.unmute = (volume) => {
  if (!mediaElement) return;
  mediaElement.muted = false;
  mediaElement.volume = volume;
}
AudioConference.volume = (volume) => {
  if (!mediaElement) return;
  mediaElement.volume = volume;
}