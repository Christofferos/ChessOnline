const express = require('express');
const model = require('../model.js');

const router = express.Router();

/**
 * Fetch the list the currently active rooms
 * @returns {void}
 */
router.get('/assistants', (req, res) => {
  console.log('All assistants ', model.getAssistants());
  res.status(200).json({ list: model.getAssistants() });
});

router.post('/assistantName', (req, res) => {
  const assistantName = model.findAssistant(req.body.assistantId).name;
  res.status(200).json({ assistantName });
});

router.delete('/removeSession', (req, res) => {
  let success = false;
  if (req.session) {
    console.log('Cookie from removeSession endpoint: ', res.cookie);
    // Invalidate cookie
    res.clearCookie('assistantId');
    res.clearCookie('username');
    res.clearCookie('connect.sid');

    // Destroy session
    req.session.destroy();
    console.log('Session: ', req.session);
    success = true;
  }
  res.status(200).json({ success });
});

module.exports = { router };
