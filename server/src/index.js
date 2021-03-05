// enhances log messages with timestamps etc
const betterLogging = require('better-logging');

const { Theme } = betterLogging;
betterLogging(console, {
  color: Theme.green,
});

// FIREBASE DATABSE:
const firebaseConfig = {
  apiKey: 'AIzaSyCZZR1B2MX_vNMuH41WCez1oQkFd4A_mCE',
  authDomain: 'chessonlinepro.firebaseapp.com',
  projectId: 'chessonlinepro',
  storageBucket: 'chessonlinepro.appspot.com',
  messagingSenderId: '59988433154',
  appId: '1:59988433154:web:b43f906e670538ee548a1b',
  measurementId: 'G-DTBVHHB8X8',
};

const path = require('path'); // helper library for resolving relative paths
const expressSession = require('express-session');
const socketIOSession = require('express-socket.io-session');
const express = require('express');
const http = require('http');

console.logLevel = 4; // Enables debug output
const publicPath = path.join(__dirname, '..', '..', 'client', 'dist');
const port = 8989; // The port that the server will listen to
const app = express(); // Creates express app

const httpServer = http.Server(app);
const io = require('socket.io').listen(httpServer); // Creates socket.io app

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
  secret: 'Secret password?',
  assistantId: -1,
  assistantName: '',
  resave: true,
  saveUninitialized: true,
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
const auth = require('./controllers/auth.controller.js');
const timeSlot = require('./controllers/timeSlot.controller.js');
const assistant = require('./controllers/assistant.controller.js');

app.use('/api', auth.router);
app.use('/api', auth.requireAuth, timeSlot.router);
app.use('/api', assistant.router);

// Init model
const model = require('./model.js');

model.init({ io });
model.addAssistant(0, 'kri');
model.addAssistant(1, 'amanda');
model.addAssistant(2, 'anna');
model.addAssistant(3, 'solbritt');

// Handle connected socket.io sockets
io.on('connection', (/* socket */) => {
  // This function serves to bind socket.io connections to user models
  /* if (socket.handshake.session.userID
    && model.findUser(socket.handshake.session.userID) !== undefined) {
    // If the current user already logged in and then reloaded the page
    model.updateUserSocket(socket.handshake.session.userID, socket);
  } else {
    socket.handshake.session.socketID = model.addUnregisteredSocket(socket);
    socket.handshake.session.save((err) => {
      if (err) console.error(err);
      else console.debug(`Saved socketID: ${socket.handshake.session.socketID}`);
    });
  } */
});

// Start server
httpServer.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
});
