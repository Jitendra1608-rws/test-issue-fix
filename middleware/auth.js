const jwt = require('jsonwebtoken');
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

module.exports = { checkAuth };
