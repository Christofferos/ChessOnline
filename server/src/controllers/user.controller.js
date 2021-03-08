const express = require('express');
const bcrypt = require('bcrypt');
const model = require('../model.js');
const db = require('../database');

const saltRounds = 10;

const router = express.Router();

router.post('/signUp', (req, res) => {
  const success = model.addUser(req.body.username);
  if (success) {
    console.log('success: ', success);
    db.serialize(() => {
      const statement = db.prepare('INSERT INTO users VALUES (?, ?)');
      bcrypt.hash(req.body.username, saltRounds, (err, hash) => {
        console.log('add user: ', req.body.username, ' ', hash);
        statement.run(req.body.username, hash);
        statement.finalize();
        res.status(200).json({ success });
      });
    });
  } else {
    console.log('Sign up failed!');
    res.status(200).json({ success });
  }
});

router.put('/signOut', (req, res) => {
  req.session.destroy();
  res.status(200).end();
});

module.exports = { router };
