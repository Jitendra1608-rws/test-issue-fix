const express = require('express');
const router = express.Router();
const { processUser, safeMerge, sanitizeForHtml } = require('../utils/helpers');
const { getUsers, getUserById, findUsersBySearch } = require('../lib/users');

router.get('/user', (req, res) => {
  const id = req.query.id;
  const user = getUserById(id);
  res.json(user ?? { error: 'Not found' });
});

router.post('/merge', (req, res) => {
  const defaultConfig = { theme: 'light', limit: 10 };
  const userConfig = req.body ?? {};
  const merged = safeMerge(defaultConfig, userConfig);
  res.json(merged);
});

router.get('/search', (req, res) => {
  const q = req.query.q ?? '';
  const results = findUsersBySearch(q);
  res.json({ query: sanitizeForHtml(q), results });
});

router.get('/users', (req, res) => {
  const users = getUsers();
  res.json(users.map(processUser));
});

module.exports = router;
