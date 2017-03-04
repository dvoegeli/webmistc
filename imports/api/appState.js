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
  /*WHITEBOARD*/
  whiteboard_fullscreen: false,

  mic_muted: false,

  tool_type: 'draw',
  tool_color: 'red',
  tool_size: 'medium',
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

// TODO: create guard in case query is not a boolean
AppState.toggle = (query) => {
  State.update( { [query]: { $exists: true } }, { 
    $set: { 
      [query]: !AppState.get(query) 
    } 
  });
}

AppState.set = (query, value) => {
  if(typeof value === "string"){
    query = { [query]: value };
  } 
  State.update( { [query]: { $exists: true } }, { $set: query });
}