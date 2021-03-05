/**
 * @class Room
 */
class Room {
  constructor(name) {
    this.messages = [];
    this.name = name;
  }

  addMessage(message) {
    this.messages.push(message);
  }
}

module.exports = Room;
