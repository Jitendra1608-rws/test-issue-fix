/**
 * BUGGY APP - Intentional security issues and bad practices
 * - Hardcoded secrets, eval(), deprecated Buffer, no input validation
 */
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 3000;

// SECURITY: Hardcoded secret keys and credentials
const JWT_SECRET = 'my-super-secret-key-12345';
const DB_PASSWORD = 'admin123';
const API_KEY = 'sk_live_abc123xyz789';

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// SECURITY: Using eval with user input (Code Injection)
app.get('/calc', (req, res) => {
  const expr = req.query.expression || '1+1';
  try {
    const result = eval(expr);  // DANGEROUS - never use eval with user input
    res.send({ result });
  } catch (e) {
    res.status(500).send({ error: e.message });
  }
});

// SECURITY: Deprecated Buffer constructor (buffer-alloc)
app.get('/encode', (req, res) => {
  const text = req.query.text || 'hello';
  const buf = new Buffer(text, 'utf8');  // Deprecated - use Buffer.from()
  res.send({ encoded: buf.toString('base64') });
});

// Duplicate auth logic (repeated in routes/auth.js and routes/user.js)
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

// Routes
app.use('/api', require('./routes/api'));
app.use('/auth', require('./routes/auth'));
app.use('/user', require('./routes/user'));

app.get('/', (req, res) => {
  res.render('index', { title: 'Buggy App', userInput: req.query.q || '' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
  console.log('DB Password:', DB_PASSWORD);  // SECURITY: Logging secrets
});

module.exports = app;
