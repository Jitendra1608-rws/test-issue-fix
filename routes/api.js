/**
 * BUGGY API - SQL injection, XSS, prototype pollution, no validation
 */
const express = require('express');
const _ = require('lodash');
const router = express.Router();

// Fake DB - in real app this would be SQL
const users = [
  { id: 1, name: 'Alice', email: 'alice@test.com', role: 'user' },
  { id: 2, name: 'Bob', email: 'bob@test.com', role: 'admin' }
];

router.get('/user', (req, res) => {
  const id = req.query.id;
  const user = users.find(u => String(u.id) === String(id));
  res.json(user || { error: 'Not found' });
});

// SECURITY: Prototype pollution via lodash merge (CVE in older lodash)
router.post('/merge', (req, res) => {
  const defaultConfig = { theme: 'light', limit: 10 };
  const userConfig = req.body;
  const merged = _.merge({}, defaultConfig, userConfig);  // Vulnerable to __proto__
  res.json(merged);
});

// SECURITY: XSS - reflecting user input without sanitization
router.get('/search', (req, res) => {
  const q = req.query.q || '';
  const results = users.filter(u =>
    u.name.toLowerCase().includes(q.toLowerCase()) ||
    u.email.toLowerCase().includes(q.toLowerCase())
  );
  res.json({ query: q, results });  // q sent back unsanitized
});

// Duplicate logic - same as in utils/helpers.js processUser()
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

router.get('/users', (req, res) => {
  const processed = users.map(processUser);
  res.json(processed);
});

module.exports = router;
