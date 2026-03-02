/**
 * BUGGY AUTH - Hardcoded credentials, weak JWT, duplicate auth logic
 */
const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

const JWT_SECRET = 'my-super-secret-key-12345';  // Duplicate hardcoded secret

// SECURITY: Hardcoded credentials - never do this
const VALID_USERS = {
  admin: 'password123',
  user: 'user123',
  test: 'test'
};

// Duplicate auth check (same logic as app.js checkAuth)
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

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).send('Missing credentials');
  }
  if (VALID_USERS[username] === password) {
    // SECURITY: No expiry, weak secret
    const token = jwt.sign(
      { username, role: username === 'admin' ? 'admin' : 'user' },
      JWT_SECRET,
      { expiresIn: '9999d' }  // Essentially no expiry
    );
    res.cookie('token', token, { httpOnly: false, secure: false });
    return res.json({ token, success: true });
  }
  res.status(401).send('Invalid credentials');
});

router.get('/me', checkAuth, (req, res) => {
  res.json(req.user);
});

module.exports = router;
