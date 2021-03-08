const express = require('express');
const bcrypt = require('bcrypt');
const model = require('../model.js');
const db = require('../database');

const router = express.Router();

/**
 * requireAuth is an endpoint guard for logged in users.
 * aka: A middle ware used to limit access to an endpoint to authenticated users
 * @param {Request} req
 * @param {String} req.session.userID - A string that uniquely identifies the given user.
 * @param {Response} res
 * @param {Function} next
 * @returns {void}
 */
const requireAuth = (req, res, next) => {
  const maybeUser = model.findUser(req.session.userID);
  // "auth" check
  if (maybeUser === undefined) {
    res
      .status(401)
      .send(
        'Unauthorized. Please make sure you are logged in before attempting this action again.',
      );
    return;
  }

  next();
};

/**
 * Tells the client if they are in an authenticated user-session.
 * @param {String} req.session.userID - A string that uniquely identifies the given user.
 * @returns {void}
 */
router.get('/isAuthenticated', (req, res) => {
  const maybeUser = model.findUser(req.session.userID);
  res.status(200).json({
    isAuthenticated: maybeUser !== undefined,
    username: maybeUser !== undefined ? maybeUser.name : 'N/A',
  });
});

/**
 * Attempts to authenticate the user-session
 * @param {String} req.body.username - The username of the user attempting to authenticate
 * @param {String} req.session.userID - A string that uniquely identifies the given user.
 * @returns {void}
 */
router.post('/authenticate', (req, res) => {
  // Check if the user actually exists instead of creating a new one
  const { username, password } = req.body;

  db.serialize(() => {
    const statement = db.prepare('SELECT username, password FROM users WHERE username = (?)');
    statement.get(username, async (err, row) => {
      if (err) {
        throw new Error(err);
      }
      if (typeof row !== 'undefined') {
        const match = await bcrypt.compare(password, row.password);
        if (match) {
          statement.finalize();
          // Update the userID of the currently active session
          req.session.userID = row.username;
          console.log('Session from /authenticate route:');
          console.log(req.session);
          req.session.save(error => {
            if (error) {
              console.error(error);
              res.sendStatus(401);
            } else {
              console.debug('Saved session');
            }
          });
          res.sendStatus(200);
        } else if (!match) {
          statement.finalize();
          res.sendStatus(404);
        }
      } else {
        statement.finalize();
        res.sendStatus(404);
      }
    });
  });

  /* if (user !== undefined) {
    // Update the userID of the currently active session
    req.session.userID = username;
    req.session.save(err => {
      if (err) {
        console.error(err);
        res.status(401); // 404 maybe
      } else {
        console.debug(`Saved userID: ${req.session.userID}`);
      }
    });

    console.log('sign in as ', username);
    res.status(200).end();
  } else {
    console.log('user not found');
    res.status(404).end();
  } */
});

// TODO: Add 'create account' route.
// The 'authenticate' route is only supposed to check if the user can login.

module.exports = { router, requireAuth };
