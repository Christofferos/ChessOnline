const express = require('express');
const model = require('../model.js');
/* const db = require('../database'); */

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
  model.addLiveGame(gameId);
  res.json({ gameId });
});

module.exports = { router };