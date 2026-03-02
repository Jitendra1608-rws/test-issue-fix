/**
 * BUGGY USER ROUTES - Duplicate code, no rate limiting, same auth again
 */
const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

const JWT_SECRET = 'my-super-secret-key-12345';  // Same secret again

// Duplicate auth logic - third copy
function checkAuth(req, res, next) {
  const token = req.headers.authorization || req.cookies.token;
  if (!token) return res.status(401).send('Unauthorized');
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch (e) {
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
