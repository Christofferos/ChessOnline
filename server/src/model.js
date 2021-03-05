const TimeSlot = require('./models/timeslot.model');
const Assistant = require('./models/assistant.model');
const db = require('./database');

/**
 * rooms & users are effectively hash maps with the name of the entry serving as a unique key.
 */
let timeSlots = {};
let timeSlotId = 0;
let assistants = {};

/**
 * unregisteredSockets is used as a temporary pool of sockets
 * that belonging to users who are yet to login.
 */
/* const nextUnregisteredSocketID = 0;
const unregisteredSockets = {}; */

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
/* exports.addUnregisteredSocket = (socket) => {
  const socketID = nextUnregisteredSocketID;
  nextUnregisteredSocketID += 1;

  unregisteredSockets[socketID] = socket;
  return socketID;
};

const assignUnregisteredSocket = (socketID) => {
  const socket = unregisteredSockets[socketID];
  unregisteredSockets = Object.keys(unregisteredSockets)
    .filter((sockID) => sockID !== socketID)
    .reduce(
      (res, sockID) => ({ ...res, [sockID]: unregisteredSockets[sockID] }),
      {}
    );

  return socket;
}; */

/**
 * Add a time slot & push it out to all connected clients
 * @param {String} timeSlot - The time slot to add.
 * @returns {void}
 */
exports.addTimeSlot = (assistantId, time) => {
  const newTimeSlot = new TimeSlot(assistantId, timeSlotId, time, '');
  timeSlots = {
    ...timeSlots,
    [timeSlotId]: newTimeSlot,
  };
  console.log('added');
  console.log(assistantId, time);

  timeSlotId += 1;
  console.log('timeSlotId: ', timeSlotId);
  exports.io.emit('timeSlotAdded', newTimeSlot);

  db.serialize(() => {
    const statement = db.prepare('INSERT INTO timeslots VALUES (?, ?, ?, ?)');
    statement.run(timeSlotId, assistantId, time, '');
    statement.finalize();
  });

  return newTimeSlot;
};

/**
 * Add an assistant to the datastructure assistants.
 * @param {int} assistantId - id of the assistant to add.
 * @param {String} name - name of the assistant to add.
 * @returns {void}
 */
exports.addAssistant = (assistantId, name) => {
  const newAssistant = new Assistant(assistantId, name);
  assistants = {
    ...assistants,
    [assistantId]: newAssistant,
  };
};

/**
 * Updated the socket associated with the user with the given name.
 * @param {String} name - The name of the user.
 * @param {SocketIO.Socket} socket - A socket.io socket.
 * @returns {void}
 */
/* exports.updateUserSocket = (name, socket) => {
  users[name].socket = socket;
}; */

/**
 * Returns the user object with the given name.
 * @param {int} assistantId - id of the assistant to find.
 * @returns {Assistant}
 */
exports.findAssistant = (assistantId) => {
  if (Object.values(assistants)[assistantId] !== null) {
    return Object.values(assistants)[assistantId];
  }
  return undefined;
};

/**
 * Returns all the Assistants.
 * @returns {Assistants[]}
 */
exports.getAssistants = () => Object.values(assistants);

/**
 * Returns all the TimeSlots.
 * @returns {TimeSlot[]}
 */
exports.getTimeSlot = (id) => {
  console.log(id);
  if (Object.values(timeSlots)[id] !== null) {
    exports.io.emit('timeSlotReserved', Object.values(timeSlots)[id]);
    return Object.values(timeSlots)[id];
  }
  return undefined;
};

exports.cancelReservedTime = (id) => {
  exports.io.emit('cancelReservedTime', Object.values(timeSlots)[id]);
  timeSlots[id].bookedBy = '';
};

exports.checkTimeSlotStatus = (id) => {
  // console.log('Booked: ', Object.values(timeSlots)[id].bookedBy);
  if (Object.values(timeSlots)[id].bookedBy === '') {
    // console.log('free: ');
    return 'free';
  }
  if (Object.values(timeSlots)[id].bookedBy === 'Reserved!') {
    // console.log('reservered: ');
    return 'reserved';
  }
  // console.log('taken: ');
  return 'taken';
};

exports.bookTimeSlot = (studentName, id) => {
  if (Object.values(timeSlots)[id] !== undefined) {
    Object.values(timeSlots)[id].bookedBy = studentName;

    db.serialize(() => {
      const statement = db.prepare('UPDATE timeslots SET bookedBy = (?) WHERE id = (?)');
      statement.run(studentName, id);
      statement.finalize();
    });

    exports.io.emit('timeSlotTaken', Object.values(timeSlots)[id]);
  } else {
    console.log('Failed to book timeSlot');
  }
};

/**
 * Returns all the TimeSlots.
 * @returns {TimeSlot[]}
 */
exports.getTimeSlots = () => Object.values(timeSlots);

/**
 * Returns all the TimeSlots of a given assistant.
 * @param {int} assistantId - id of the assistant.
 * @returns {TimeSlot[]}
 */
exports.getAssistantTimeSlots = (assistantId) => {
  console.log('');
  return Object.values(timeSlots).filter((timeSlot) => {
    console.log('');
    return timeSlot.assistantId === assistantId;
  });
};

/**
 * Removes the timeslot object with the matching id.
 * @param {int} id - The id of the time slot.
 * @returns {void}
 */
exports.removeTimeSlots = (ids, assistantId) => {
  timeSlots = Object.values(timeSlots) // export time slot?
    .filter((timeSlot) => !ids.includes(timeSlot.id) || timeSlot.assistantId !== assistantId)
    .reduce((res, timeSlot) => ({ ...res, [timeSlot.id]: timeSlot }), {});

  exports.io.emit('remainingTimeSlots', timeSlots); // RemainingTimeSlots

  db.serialize(() => {
    const statement = db.prepare('DELETE FROM timeslots WHERE id = (?) AND assistantId= (?)');
    ids.map((id) => statement.run(id, assistantId));
    statement.finalize();
    return '';
  });
  return timeSlots;
};

exports.authorizedToRemoveTimeSlots = (ids, assistantId) => {
  let result = true;
  console.log('ids: ', ids);
  Object.values(timeSlots).forEach((timeSlot) => {
    console.log('timeSlot: ', timeSlot);
    console.log('assistantId: ', assistantId);
    if (ids.includes(timeSlot.id) && timeSlot.assistantId !== assistantId) {
      console.log('Condition met!');
      result = false;
    }
  });
  return result;
};

/**
 * Return the time slot object with the matching name.
 * @param {String} id - The id of the time slot.
 * @returns {Room}
 */
exports.findTimeSlot = (id) => timeSlots[id];
