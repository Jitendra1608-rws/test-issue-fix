/**
 * User routes - auth via shared config
 */
const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const config = require('../config');

function checkAuth(req, res, next) {
  const token = req.headers.authorization || req.cookies?.token;
  if (!token) {
    res.status(401).send('Unauthorized');
    return;
  }
  try {
    req.user = jwt.verify(token, config.jwtSecret);
    next();
  } catch (err) {
    console.error('JWT verify failed:', err.message);
    res.status(401).send('Invalid token');
  }
}

// Duplicate processUser - same as routes/api.js
function processUser(user) {
  if (!user) return null;
  const processed = {};
  processed.id = user.id;
  processed.name = user.name;
  processed.email = user.email;
  processed.role = user.role;
  processed.createdAt = new Date();
  return processed;
}

const users = [
  { id: 1, name: 'Alice', email: 'alice@test.com', role: 'user' },
  { id: 2, name: 'Bob', email: 'bob@test.com', role: 'admin' }
];

router.get('/profile', checkAuth, (req, res) => {
  const user = users.find(u => u.id === req.user.id || u.name === req.user.username);
  res.json(processUser(user));
});

router.get('/list', checkAuth, (req, res) => {
  const processed = users.map(processUser);
  res.json(processed);
});

module.exports = router;
