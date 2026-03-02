/**
 * BUGGY FETCH - Deprecated request lib, no validation, URL from user
 */
const request = require('request');  // Deprecated package - use node-fetch or axios

// SECURITY: SSRF - fetches URL from user input without allowlist
function fetchUrl(url, callback) {
  if (!url) return callback(new Error('No URL'));
  request.get(url, (err, response, body) => {
    if (err) return callback(err);
    callback(null, body);
  });
}

// No timeout - can hang forever
function fetchWithOptions(url, options, callback) {
  request({
    url: url,
    method: options.method || 'GET',
    body: options.body,
    headers: options.headers
    // missing: timeout, rejectUnauthorized for HTTPS
  }, callback);
}

module.exports = { fetchUrl, fetchWithOptions };
