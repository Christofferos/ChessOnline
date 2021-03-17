/**
 * @class MatchHistory
 */
class MatchHistory {
  constructor(opponent, winner, nrMoves, date) {
    this.opponent = opponent;
    this.winner = winner;
    this.nrMoves = nrMoves;
    this.date = date;
  }
}

module.exports = MatchHistory;
