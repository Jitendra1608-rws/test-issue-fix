/**
 * Auth - credentials and JWT secret from env
 */
const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const config = require('../config');

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
    res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
    return res.json({ token, success: true });
  }
  res.status(401).send('Invalid credentials');
});

router.get('/me', checkAuth, (req, res) => {
  res.json(req.user);
});

module.exports = router;
