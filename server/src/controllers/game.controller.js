const express = require('express');
const model = require('../model.js');
const db = require('../database');

const router = express.Router();

function makeId(length) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i += 1) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

router.post('/newGame', (req, res) => {
  console.log('new game');
  const gameId = makeId(8);
  model.addLiveGame(gameId, req.session.userID);
  db.serialize(async () => {
    const statement = db.prepare('INSERT INTO liveGames VALUES (?, ?, ?, ?, ?, ?)');
    statement.run(gameId, '', req.session.userID, '', 180, 180);
  });
  res.json({ gameId });
});

router.post('/movePiece', (req, res) => {
  console.log('request to move piece');
  /* console.log('Game ID: ', req.body.id);
  console.log('Start pos: ', req.body.startPos);
  console.log('End pos: ', req.body.endPos); */
  const fen = model.movePiece(req.body.id, req.body.startPos, req.body.endPos);
  db.serialize(async () => {
    // Update gameState in db
    const statement = db.prepare('UPDATE liveGames SET gameState = (?) WHERE id = (?)');
    statement.run(fen, req.body.id);
  });
  res.status(200).json({ success });
});

router.delete('/removeGame', (req, res) => {
  console.log('remove game');
  model.removeLiveGame(req.body.id);

  db.serialize(async () => {
    const statement = db.prepare('DELETE FROM liveGames WHERE id = (?)');
    statement.run(req.body.id);
  });
  res.status(200).end();
});

module.exports = { router };
