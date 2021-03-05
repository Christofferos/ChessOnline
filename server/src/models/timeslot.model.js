/**
 * @class TimeSlot
 */
class TimeSlot {
  constructor(assistantId, id, time, studentName) {
    this.assistantId = assistantId; // Foreign key (Number)
    this.id = id; // (Number)
    this.time = time; // Tiden som visas för studenten (String)
    this.bookedBy = studentName; // Studentens namn (String)
  }
}

module.exports = TimeSlot;
