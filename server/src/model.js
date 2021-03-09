/* const Room = require('./models/room.model'); */
const User = require('./models/user.model');
const LiveGame = require('./models/liveGame.model');
const db = require('./database');

/**
 * games & users are effectively hash maps with the name of the entry serving as a unique key.
 */
let users = {};
let games = {};

/**
 * unregisteredSockets is used as a temporary pool of sockets
 * that belonging to users who are yet to login.
 */
let nextUnregisteredSocketID = 0;
let unregisteredSockets = {};

// Will be initialized in the exports.init function
exports.io = undefined;

/**
 * Initialize the model
 * @param { { io: SocketIO.Server} } config - The configurations needed to initialize the model.
 * @returns {void}
 */
exports.init = ({ io }) => {
  exports.io = io;
};

/**
 * Add a socket.io socket to the pool of unregistered sockets
 * @param {SocketIO.Socket} socket - The socket.io socket to add to the pool.
 * @returns {Number} The ID of the socket in the pool of unregistered sockets.
 */
exports.addUnregisteredSocket = socket => {
  const socketID = nextUnregisteredSocketID;
  nextUnregisteredSocketID += 1;

  unregisteredSockets[socketID] = socket;
  return socketID;
};

const assignUnregisteredSocket = socketID => {
  const socket = unregisteredSockets[socketID];
  unregisteredSockets = Object.keys(unregisteredSockets)
    .filter(sockID => sockID !== socketID)
    .reduce((res, sockID) => ({ ...res, [sockID]: unregisteredSockets[sockID] }), {});
  return socket;
};

const gamesInit = () => {
  // Fill games with db data
  db.serialize(() => {
    games = {};
    db.each('SELECT * FROM liveGames', (err, row) => {
      games[row.id] = new LiveGame(
        row.id,
        row.gameState,
        row.player1,
        row.player2,
        row.timeLeft1,
        row.timeLeft2,
      );
    });
  });
};
gamesInit();

const usersInit = async () => {
  // Fill users with db data
  db.serialize(() => {
    users = {};
    db.each('SELECT * FROM users', (err, row) => {
      users[row.username] = new User(row.username);
    });
  });
};
usersInit();

/**
 * Add a message to a room & push out the message to all connected clients
 * @param {String} roomName - The name of the room to add the message to.
 * @param {String} message - The message to add.
 * @returns {void}
 */
exports.addMessage = (roomName, message) => {
  exports.findLiveGame(roomName).addMessage(message);
  exports.io.in(roomName).emit('msg', message);
};

/**
 * Creates a user with the given name.
 * @param {String} name - The name of the user.
 * @param {Number} socketID - An optional ID of a socket.io socket in the unregistered sockets pool.
 * @see model.addUser
 * @returns {void}
 */
exports.addUser = (name, socketID = undefined) => {
  if (users[name] !== undefined) {
    // Username taken.
    return false;
  }
  users[name] = new User(name);
  if (socketID !== undefined) {
    users[name].socket = assignUnregisteredSocket(socketID);
  }
  return true;
};

/**
 * Updated the socket associated with the user with the given name.
 * @param {String} name - The name of the user.
 * @param {SocketIO.Socket} socket - A socket.io socket.
 * @returns {void}
 */
exports.updateUserSocket = (name, socket) => {
  users[name].socket = socket;
};

/**
 * Returns the user object with the given name.
 * @param {String} name - The name of the user.
 * @returns {User}
 */
exports.findUser = name => users[name];

/**
 * Removes the user object with the matching name.
 * @param {String} name - The name of the user
 * @returns {void}
 */
exports.removeUser = name => {
  users = Object.values(users)
    .filter(user => user.name !== name)
    .reduce((res, user) => ({ ...res, [user.name]: user }), {});
};

exports.authorizedToJoinGame = (userId, gameId) => {
  if (
    games[gameId].player2 === '' ||
    userId === games[gameId].player1 ||
    userId === games[gameId].player2
  ) {
    return true;
  }
  return false;
};

/**
 * Creates a game with the given id.
 * @param {String} id - The id of the game.
 * @returns {void}
 */
exports.addLiveGame = (id, player1) => {
  games[id] = new LiveGame(id, undefined, player1, undefined, undefined, undefined);
};

/**
 * Returns all the LiveGame:s.
 * @returns {LiveGame[]}
 */
exports.getLiveGames = () => Object.values(games);

/**
 * Returns LiveGames that user is involved in.
 * @returns {LiveGame[]}
 */
exports.getLiveGames = userID =>
  Object.values(games).filter(game => game.player1 === userID || game.player2 === userID);

/**
 * Removes the liveGame object with the matching id.
 * @param {String} id - The id of the liveGame.
 * @returns {void}
 */
exports.removeLiveGame = id => {
  games = Object.values(games)
    .filter(game => game.id !== id)
    .reduce((res, game) => ({ ...res, [game.id]: game }), {});
  exports.io.emit('remainingRooms', games);
};

/**
 * Return the liveGame object with the matching id.
 * @param {String} id - The id of the game.
 * @returns {LiveGame}
 */
exports.findLiveGame = id => games[id];
