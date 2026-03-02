/**
 * Shared helpers: processUser, safeMerge, sanitization, parseId, toBase64.
 */

function processUser(user) {
  if (!user) return null;
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: new Date(),
  };
}

/** Merge defaults with user input using only own enumerable keys (avoids prototype pollution). */
function safeMerge(defaults, userInput) {
  if (userInput == null || typeof userInput !== 'object') return { ...defaults };
  const result = { ...defaults };
  for (const key of Object.keys(userInput)) {
    if (key === '__proto__' || key === 'constructor' || key === 'prototype') continue;
    if (Object.hasOwn(userInput, key)) {
      result[key] = userInput[key];
    }
  }
  return result;
}

function toBase64(str) {
  return Buffer.from(str, 'utf8').toString('base64');
}

function parseId(id) {
  return Number.parseInt(id, 10);
}

/** Escape HTML to prevent XSS when reflecting user input. */
function sanitizeForHtml(str) {
  if (str == null) return '';
  const s = String(str);
  return s
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

module.exports = { processUser, safeMerge, toBase64, parseId, sanitizeForHtml };
