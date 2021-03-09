/**
 * @class LiveGame
 */
class LiveGame {
  constructor(id, gameState, player1, player2, timeLeft1, timeLeft2) {
    this.id = id; // (Number)
    if (gameState === undefined) {
      /*
      1. Piece placement (/ === next rank on the board)
      2. Turn
      3. Castling availability
      4. En passant
      5. Halfmove clock (no capture, no pawn advancement. 50-move-rule)
      6. Fullmove clock
      */
      this.gameState = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
    } else {
      this.gameState = gameState;
    }
    if (player1 === undefined) {
      this.player1 = '';
    } else {
      this.player1 = player1;
    }
    if (player2 === undefined) {
      this.player2 = '';
    } else {
      this.player2 = player1;
    }
    if (timeLeft1 === undefined) {
      this.timeLeft1 = 180;
    } else {
      this.timeLeft1 = timeLeft1;
    }
    if (timeLeft2 === undefined) {
      this.timeLeft2 = 180;
    } else {
      this.timeLeft2 = timeLeft2;
    }
    // Not persistant
    this.messages = [];
  }

  addMessage(message) {
    this.messages.push(message);
  }
}

module.exports = LiveGame;
