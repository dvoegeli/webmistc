import 'rtcmulticonnection-v3/dist/RTCMultiConnection';
import io from 'socket.io-client';

// Hack https://github.com/socketio/socket.io-client/issues/961
import Response from 'meteor-node-stubs/node_modules/http-browserify/lib/response';
if (!Response.prototype.setEncoding) {
  Response.prototype.setEncoding = function(encoding) {
    // do nothing
  }
}

// Socket io client
window.io = io;

// VERSION 3
console.log(window.io)

const connection = new RTCMultiConnection();
connection.socketURL = 'https://rtcmulticonnection.herokuapp.com:443/';

console.log(connection)

connection.session = {
    audio: true,
    video: true,
    data : false
};
connection.sdpConstraints.mandatory = {
    OfferToReceiveAudio: true,
    OfferToReceiveVideo: true
};
connection.onstream = function(event) {
    document.body.appendChild(event.mediaElement);
    console.log('appending media')
};

connection.openOrJoin('webmistc');

console.log("streaming video+audio")