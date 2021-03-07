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
    this.player1 = player1;
    this.player2 = player2;
    this.timeLeft1 = timeLeft1;
    this.timeLeft2 = timeLeft2;
  }
}

module.exports = LiveGame;
