const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const config = require('../config');
const { checkAuth } = require('../middleware/auth');

function getValidUsers() {
  const raw = process.env.AUTH_USERS;
  if (!raw) return {};
  try {
    return JSON.parse(raw);
  } catch (err) {
    console.error('AUTH_USERS parse failed:', err.message);
    return {};
  }
}

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).send('Missing credentials');
  }
  const validUsers = getValidUsers();
  if (validUsers[username] === password) {
    const token = jwt.sign(
      { username, role: username === 'admin' ? 'admin' : 'user' },
      config.jwtSecret,
      { expiresIn: process.env.JWT_EXPIRY || '1d' }
    );
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    });
    return res.json({ token, success: true });
  }
  res.status(401).send('Invalid credentials');
});

router.get('/me', checkAuth, (req, res) => {
  res.json(req.user);
});

module.exports = router;
