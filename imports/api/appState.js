// example: set value
// note: nested objects, e.g. buzz.ding
//
// state.insert({
//   buzz: {
//     ding: true
//   }
// });
// state.update( { buzz: { $exists: true } }, { $set: { 'buzz.ding': true } } );

// example: select field
// note: ignores nested objects, e.g. foo.bar.baz
// http://docs.meteor.com/api/collections.html#fieldspecifiers
//
// state.insert({
//   buzz: true,
//   ding: true,
//   foo: {
//     bar: {
//       baz: true
//     }
//   }
// });
// state.findOne( { }, { fields: { 'foo': 1, _id: 0 } } ); 

import { Mongo } from 'meteor/mongo'; 
export const AppState = {};
export const State = new Mongo.Collection(null);

const initialState = {
  /* WHITEBOARD */
  whiteboard_fullscreen: false,
  /* MICROPHONE */

  mic_muted: false,

  /* TOOL */
  tool_type: 'draw',
  tool_color: 'red',
  tool_size: 'medium',

  /* NOTES */
  notes_menu_open: false,
  /* NOTES SERVER DATA*/
  notes_sticky: true,

  /* FEATURES */
  features_menu_open: false,
  features_show: undefined, 
  /*[undefined|question|chat|role|sound|presentation|importExport|vote]*/

  /* ROLES */
  roles_menu_open: false,
  roles_sort: 'attendee', /*[attendee|contributor|presenter|host]*/
  /* USER SERVER DATA*/
  user_role: 'attendee', /*[attendee|contributor|presenter|host]*/

  /* COLORS */
  colors_menu_open: false,
  /* COLORS SERVER DATA*/
  colors_option: 'blue', /* [purple|blue|orange|green|red] */

  /* SIZES */
  sizes_menu_open: false,
  /* COLORS SERVER DATA*/
  sizes_option: 'medium', /* [tiny|small|medium|large|huge] */

  /* SOUND */
  sound_test: false,

  /* RECORD */
  record_start: false,

  /* PLAYBACK */
  playback_start: false,

  /* MESSAGES */
  messages_list_open: false,
  messages_recipient: undefined, /*[undefined|user_id]*/

  /* VOTE */
  vote_list_open: false,
  vote_poll: undefined, /*[undefined|vote_poll_id]*/

  /* SLIDES */
  slides_menu_opened: false,
  /* SLIDE SERVER DATA*/
  slide_active: 'slide1' /*[slide1|...|slideN]*/
  slide_count: 10, /*[Integer], replace with implicit count*/

  /* WINDOW */
  window_height: undefined, /*[undefined|Integer]*/ 
  window_width: undefined, /*[undefined|Integer]*/
}

State.insert(initialState);


AppState.getAll = (query) => {
  const fields = Object
    .keys(initialState)
    .filter( namespace => !!namespace.match( new RegExp(`^${query}_`)))
    .reduce( (fields, namespace) => Object.assign(fields, { [namespace]: 1 }), {})
  return State.findOne( { }, { fields } );
};

AppState.get = (query) => State.findOne( { }, { fields: { [query]: 1} } )[query];

AppState.set = (key, value) => {
  const query = (value !== undefined) ? { [key]: value } : key;
  console.log(query)
  State.update( { [key]: { $exists: true } }, { $set: query });
}