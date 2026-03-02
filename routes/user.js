const express = require('express');
const router = express.Router();
const { checkAuth } = require('../middleware/auth');
const { processUser } = require('../utils/helpers');
const { getUsers } = require('../lib/users');

router.get('/profile', checkAuth, (req, res) => {
  const users = getUsers();
  const user = users.find(
    (u) => u.id === req.user.id || u.name === req.user.username
  );
  res.json(processUser(user ?? null));
});

router.get('/list', checkAuth, (req, res) => {
  res.json(getUsers().map(processUser));
});

module.exports = router;
