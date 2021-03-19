// enhances log messages with timestamps etc
const betterLogging = require('better-logging');

const { Theme } = betterLogging;
betterLogging(console, {
  color: Theme.green,
});

const path = require('path'); // helper library for resolving relative paths
const expressSession = require('express-session');
const socketIOSession = require('express-socket.io-session');
const express = require('express');

const SQLiteStore = require('connect-sqlite3')(expressSession);

// const http = require('http');
const https = require('https');
const fs = require('fs');

const helmet = require('helmet');

console.logLevel = 4; // Enables debug output
const publicPath = path.join(__dirname, '..', '..', 'client', 'dist');
const port = 8989; // The port that the server will listen to
const app = express(); // Creates express app

const httpsServer = https.createServer(
  {
    key: fs.readFileSync('server.key'),
    cert: fs.readFileSync('server.cert'),
  },
  app,
);
const io = require('socket.io').listen(httpsServer); // Creates socket.io app

// Setup middleware
app.use(
  betterLogging.expressMiddleware(console, {
    ip: { show: true, color: Theme.green.base },
    method: { show: true, color: Theme.green.base },
    header: { show: false },
    path: { show: true },
    body: { show: true },
  }),
);

app.use(helmet());

app.use(
  express.json(),
); /*
This is a middleware that parses the body of the request into a javascript object.
It's basically just replacing the body property like this:
req.body = JSON.parse(req.body)
*/
app.use(express.urlencoded({ extended: true }));

// Setup session
const session = expressSession({
  secret: 'Super secret! Shh! Do not tell anyone...',
  resave: true,
  saveUninitialized: true,
  rolling: true, // Passiv session invalidering
  cookie: { maxAge: 3000 }, // Passiv session invalidering
  store: new SQLiteStore(),
});
app.use(session);

io.use(
  socketIOSession(session, {
    autoSave: true,
    saveUninitialized: true,
  }),
);

// Serve client
app.use(
  express.static(publicPath),
); /*
express.static(absolutePathToPublicDirectory)
This will serve static files from the public directory, starting with index.html
*/

// Bind REST controllers to /api/*
const user = require('./controllers/user.controller.js');
const game = require('./controllers/game.controller.js');
const auth = require('./controllers/auth.controller.js');
const chat = require('./controllers/chat.controller.js');

app.use('/api', auth.router);
app.use('/api', user.router);
app.use('/api', game.router);
// All chat endpoints require the user to be authenticated
app.use('/api', auth.requireAuth, chat.router);

// Init model
const model = require('./model.js');

model.init({ io });
// Hard coded rooms.
/* model.addLiveGame('Live Game 1');
model.addLiveGame('Live Game 2');  */

// Handle connected socket.io sockets
io.on('connection', (socket) => {
  console.log('Connection ... ');

  // This function serves to bind socket.io connections to user models
  if (
    socket.handshake.session.userID
    && model.findUser(socket.handshake.session.userID) !== undefined
  ) {
    // If the current user already logged in and then reloaded the page
    model.updateUserSocket(socket.handshake.session.userID, socket);
  } else {
    socket.handshake.session.socketID = model.addUnregisteredSocket(socket);
    socket.handshake.session.save((err) => {
      if (err) {
        console.log('Connection error in index.js');
        // console.error(err);
      } else {
        console.log('Saved SocketID');
        // console.debug(`Saved socketID: ${socket.handshake.session.socketID}`);
      }
    });
  }

  // ### Client listeners: ###
  socket.on('movePiece', (gameId, startPos, endPos) => model.movePiece(gameId, startPos, endPos));

  socket.on('updateTimers', (gameId, timer1, timer2) => model.updateTimers(gameId, timer1, timer2));

  socket.on('backToMenu', (gameId) => {
    model.backToMenu(gameId);
    model.removeLiveGame(gameId);
  });

  socket.on('getMatchHistory', (userId) => model.getMatchHistory(userId));
});

// Start server
httpsServer.listen(port, () => {
  console.log(`Listening on https://localhost:${port}`);
});
