/**
 * BUGGY HELPERS - Duplicate logic, unsafe defaults, deprecated APIs
 */
const _ = require('lodash');

// Duplicate of processUser from routes/api.js and routes/user.js
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

// SECURITY: Defaults to merge can lead to prototype pollution with user input
function mergeConfig(defaults, userInput) {
  return _.merge({}, defaults, userInput);
}

function toBase64(str) {
  return Buffer.from(str, 'utf8').toString('base64');
}

function parseId(id) {
  return Number.parseInt(id, 10);
}

module.exports = { processUser, mergeConfig, toBase64, parseId };
