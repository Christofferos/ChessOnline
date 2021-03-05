const express = require('express');
const model = require('../model.js');

const router = express.Router();

/**
 * Fetch the list the currently active rooms
 * @returns {void}
 */
router.get('/timeSlots', (req, res) => {
  console.log('Request cookie in timeSlots: ', req.headers.cookie);
  const timeSlots = model.getTimeSlots();
  res.status(200).json({ list: timeSlots });
});

router.post('/reserveTimeSlot', (req, res) => {
  const timeSlot = model.getTimeSlot(req.body.timeSlotId);
  timeSlot.bookedBy = 'Reserved!';
  res.status(200).json({ timeSlot });
});

router.get('/getAssistantTimeSlots', (req, res) => {
  res.status(200).json({ list: model.getAssistantTimeSlots(req.session.assistantId) });
});

router.post('/addTimeSlot', (req, res) => {
  res.status(200).json({ newTimeSlot: model.addTimeSlot(req.session.assistantId, req.body.time) });
  // .end()
});

router.put('/cancelReservedTime', (req, res) => {
  model.cancelReservedTime(req.body.timeSlotId);
  res.status(200).end();
});

router.put('/confirmBookedTime', (req, res) => {
  model.bookTimeSlot(req.body.studentName, req.body.timeSlotId);
  res.status(200).end();
});

router.post('/checkTimeSlotStatus', (req, res) => {
  const status = model.checkTimeSlotStatus(req.body.timeSlotId);
  console.log('status: ', status);
  if (status === 'free') res.status(200).json({ status });
  else res.status(403).json({ status });
});

router.delete('/removeTimeSlots', (req, res) => {
  const success = model.authorizedToRemoveTimeSlots(
    req.body.timeSlotsToRemove,
    req.session.assistantId,
  );
  const remainingTimeSlots = model.removeTimeSlots(
    req.body.timeSlotsToRemove,
    req.session.assistantId,
  );
  res.status(200).json({ success, remainingTimeSlots });
});

/**
 * Join the specific room.
 * This will allow the user-session to listen to and post messages in the given room.
 * @param {String} req.params.room - The id of the room you would like to join
 * @param {String} req.session.userID - A string that uniquely identifies the given user.
 * @returns {void}
 */
router.get('/room/:room/join', (req, res) => {
  const room = model.findRoom(req.params.room);
  if (room === undefined) {
    res.status(404).json({
      msg: `No room with ID: ${req.params.room}`,
      href_roomList: '/roomList',
    });
    return;
  }
  const user = model.findUser(req.session.userID);

  // Join the right socket.io room
  user.currentRoom = room.name;
  user.socket.join(user.currentRoom);

  // Send join message
  model.addMessage(user.currentRoom, `${user.name} joined the room!`);

  // Send http response
  res.status(200).json({
    list: room.messages,
    msg: `Successfully joined room: ${room.name}`,
    href_messages: `/room/${room.name}`,
    href_send_message: `/room/${room.name}/message`,
  });
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

  const room = model.findRoom(req.params.room);
  model.addMessage(room.name, `${user.name}: ${req.body.message}`);

  res.sendStatus(200);
});

module.exports = { router };
