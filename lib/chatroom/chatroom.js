'use strict';


// Create a TCP Server using the NodeJS net module
// Create a Client constructor that models an individual connection.
// Each client instance should contain at least an id, nickname, and socket.
// Clients should be able to send messages to all other clients by sending it to the server
// Clients should be able to run special commands by sending messages that start with a command name
// The client should send @quit to disconnect
// The client should send @list to list all connectued users
// The client should send @nickname <new-name> to change their nickname
// The client should send @dm <to-username> <message> to send a message directly to another user by nickname
// Connected clients should be maintained in an in memory collection called the clientPool
// When a socket emits the close event, the socket should be removed from the client pool
// When a socket emits the error event, the error should be logged on the server
// When a socket emits the data event, the data should be logged on the server and the commands below should be implemented


const EventEmitter = require('events');
const net = require('net');

const uuid = require('uuid/v4');

const port = process.env.PORT || 3001;
const server = net.createServer();
const events = new EventEmitter();
const socketPool = {};

let User = function(socket) {
  let id = uuid();
  this.id = id;
  this.nickname = `User-${id}`;
  this.socket = socket;
};


server.on('connection', (socket) => {
  let user = new User(socket);
  socketPool[user.id] = user;
  socket.on('data', (buffer) => dispatchAction(user.id, buffer));
});

/**
 * Command Parser
 * Handles commands such as:
 *    @all message
 *    @nick newname
 *    @quit
 *    @kick username
 *    @list
 *    @dm username message
 * @param buffer
 * @returns {*}
 *    format:
 *      command: the @command given
 *      payload: the full text after the @command
 *      target: the first word after the @command (might be useful for @dm, @kick)
 *      message: all of the words after "target" (only useful for @dm)
 */

let parse = (buffer) => {

  let text = buffer.toString().trim();
  if ( !text.startsWith('@') ) { return null; }
  let [command,payload] = text.split(/\s+(.*)/);
  let [target,message] = payload.split(/\s+(.*)/);
  return {command,payload,target,message};

};

/**
 * Dispatcher -- parses the command buffer and then triggers an event with:
 *    command
 *    parsed entry object
 *    and the current user's id
 * @param userId
 * @param buffer
 */
let dispatchAction = (userId, buffer) => {
  let entry = parse(buffer);
  entry && events.emit(entry.command, entry, userId);
};

/**
 * Command Handlers.
 * These respond when events are triggered (emitted) that match their "on" clause
 * This patter rocks ... you can add/remove command support without adding any
 * conditional logic, just listeners
 */

events.on('@all', (data, userId) => {
  for( let connection in socketPool ) {
    let user = socketPool[connection];
    user.socket.write(`<${socketPool[userId].nickname}>: ${data.payload}\n`);
  }
});

events.on('@nick', (data, userId) => {

  socketPool[userId].nickname = data.target;

});

events.on('@dm', (data, userId) => {
  console.log(data.target);
  console.log(data.message);
  for(var property1 in socketPool){
    if(socketPool[property1].nickname === data.target){
      socketPool[property1].socket.write(`<Direct Message from ${socketPool[userId].nickname}>: ${data.message}\n`);
    }
  }
});

events.on('@list', (userId) => {

  let nicknames;

  let userArr = Object.keys(socketPool);

  for( let i = 0 ; i < Object.keys(socketPool).length ; i++ ){

    nicknames += socketPool[userArr[i]].nickname;

  }

  socketPool[userId].socket.write(nicknames);

});

events.on('@quit', (userId) => {

  socketPool[userId].socket.write('Goodbye.');

  delete socketPool[userId];
  
});

server.listen(port, () => {
  console.log(`Chat Server up on ${port}`);
});