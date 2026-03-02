/**
 * Safe HTTP client: URL allowlist to prevent SSRF, timeout, and TLS validation.
 */

const https = require('node:https');
const http = require('node:http');

const DEFAULT_TIMEOUT_MS = 10000;

function getAllowedHosts() {
  const raw = process.env.ALLOWED_FETCH_HOSTS;
  if (!raw) return new Set(['localhost', '127.0.0.1']);
  return new Set(raw.split(',').map((h) => h.trim().toLowerCase()));
}

function isUrlAllowed(urlStr) {
  let url;
  try {
    url = new URL(urlStr);
  } catch {
    return false;
  }
  if (url.protocol !== 'http:' && url.protocol !== 'https:') return false;
  const allowed = getAllowedHosts();
  const host = url.hostname.toLowerCase();
  return allowed.has(host);
}

function fetchUrl(url, options = {}, callback) {
  if (typeof options === 'function') {
    callback = options;
    options = {};
  }
  if (!url || typeof url !== 'string') {
    process.nextTick(() => callback(new Error('No URL')));
    return;
  }
  if (!isUrlAllowed(url)) {
    process.nextTick(() => callback(new Error('URL host not in allowlist')));
    return;
  }

  const timeout = options.timeout ?? DEFAULT_TIMEOUT_MS;
  const urlObj = new URL(url);
  const lib = urlObj.protocol === 'https:' ? https : http;
  const reqOptions = {
    hostname: urlObj.hostname,
    port: urlObj.port || (urlObj.protocol === 'https:' ? 443 : 80),
    path: urlObj.pathname + urlObj.search,
    method: options.method || 'GET',
    headers: options.headers || {},
    rejectUnauthorized: options.rejectUnauthorized !== false,
  };

  const req = lib.request(reqOptions, (res) => {
    const chunks = [];
    res.on('data', (c) => chunks.push(c));
    res.on('end', () => callback(null, Buffer.concat(chunks).toString()));
    res.on('error', callback);
  });
  req.on('error', callback);
  req.setTimeout(timeout, () => {
    req.destroy();
    callback(new Error('Request timeout'));
  });
  if (options.body) req.write(options.body);
  req.end();
}

function fetchWithOptions(url, options, callback) {
  fetchUrl(url, options, callback);
}

module.exports = { fetchUrl, fetchWithOptions, isUrlAllowed };
