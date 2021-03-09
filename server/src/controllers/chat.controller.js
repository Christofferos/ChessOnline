const express = require('express');
const model = require('../model.js');
const db = require('../database.js');

const router = express.Router();

/**
 * Fetch the list the currently active rooms
 * @returns {void}
 */
router.get('/roomList', (req, res) => {
  const liveGames = model.getLiveGames();
  res.status(200).json({ list: liveGames });
});

router.get('/userRoomList', (req, res) => {
  const liveGames = model.getLiveGames(req.session.userID);
  res.status(200).json({ list: liveGames });
});

/**
 * Join the specific room.
 * This will allow the user-session to listen to and post messages in the given room.
 * @param {String} req.params.room - The id of the room you would like to join
 * @param {String} req.session.userID - A string that uniquely identifies the given user.
 * @returns {void}
 */
router.get('/room/:room/join', (req, res) => {
  const room = model.findLiveGame(req.params.room);
  if (room === undefined) {
    res.status(404).json({
      msg: `No room with ID: ${req.params.room}`,
      href_roomList: '/roomList',
    });
    return;
  }

  const user = model.findUser(req.session.userID);

  if (model.authorizedToJoinGame(req.session.userID, room.id)) {
    user.currentRoom = room.id;
    user.socket.join(user.currentRoom);

    const game = model.findLiveGame(room.id);

    if (game.player1 === '') {
      game.player1 = req.session.userID;
      db.serialize(async () => {
        const statement = db.prepare('UPDATE liveGames SET player1 = (?) WHERE id = (?)');
        statement.run(req.session.userID, game.id);
      });
    } else if (game.player2 === '') {
      game.player2 = req.session.userID;
      db.serialize(async () => {
        const statement = db.prepare('UPDATE liveGames SET player2 = (?) WHERE id = (?)');
        statement.run(req.session.userID, game.id);
      });
    }

    // Send join message
    model.addMessage(user.currentRoom, `${user.name} joined the room!`);

    // Send http response
    res.status(200).json({
      list: room.messages,
      msg: `Successfully joined room: ${room.id}`,
      href_messages: `/room/${room.id}`,
      href_send_message: `/room/${room.id}/message`,
      success: true,
    });
  } else {
    console.log('FALSE????');
    res.status(401).json({ success: false });
  }
});

/**
 * Send a message in the given room.
 * @param {String} req.params.room - The id of the room you would like to join
 * @param {String} req.session.userID - A string that uniquely identifies the given user.
 * @returns {void}
 */
router.post('/room/:room/message', (req, res) => {
  const user = model.findUser(req.session.userID);
  if (user.currentRoom !== req.params.room) {
    res.status(403).json({
      msg: 'You may only send messages in rooms you are partaking in.',
      href_join: `/room/${req.params.room}/join`,
    });
    return;
  }

  const room = model.findLiveGame(req.params.room);
  model.addMessage(room.id, `${user.name}: ${req.body.message}`);

  res.sendStatus(200);
});

module.exports = { router };
