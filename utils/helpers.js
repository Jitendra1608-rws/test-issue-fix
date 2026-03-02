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

// Deprecated: Buffer alloc
function toBase64(str) {
  return new Buffer(str).toString('base64');  // Use Buffer.from(str).toString('base64')
}

// No input validation - can throw or behave unexpectedly
function parseId(id) {
  return parseInt(id, 10);  // NaN if id is not a number
}

module.exports = { processUser, mergeConfig, toBase64, parseId };
