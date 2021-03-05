/**
 * @class Assistant
 */
class Assistant {
  constructor(id, name) {
    if (id === undefined) {
      throw new Error('Id is undefined');
    }
    this.id = id;
    this.name = name;
  }
}

module.exports = Assistant;
