const express = require('express');
const bcrypt = require('bcrypt');
const model = require('../model.js');
const db = require('../database');

const saltRounds = 10;

const router = express.Router();

router.post('/signUp', (req, res) => {
  const success = model.addUser(req.body.username);
  if (success) {
    db.serialize(() => {
      const statement = db.prepare('INSERT INTO users VALUES (?, ?)');
      bcrypt.hash(req.body.username, saltRounds, (err, hash) => {
        statement.run(req.body.username, hash);
        statement.finalize();

        req.session.userID = req.body.username;

        res.status(200).json({ success });
      });
    });
  } else {
    res.status(200).json({ success });
  }
});

router.put('/signOut', (req, res) => {
  req.session.destroy();
  res.status(200).end();
});

router.get('/matchHistory/:userId', (req, res) => {
  const userId = req.params.userId.trim();
  res.status(200).json({ matchHistory: model.getMatchHistory(userId) });
});

module.exports = { router };
