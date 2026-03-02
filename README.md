# Buggy Test App (Intentional Issues)

A Node.js app with **intentional** bugs for testing static analysis tools (SonarQube, ESLint security, etc.).

## ⚠️ Do NOT use in production

### Security issues

| Location | Issue |
|----------|--------|
| `app.js` | Hardcoded `JWT_SECRET`, `DB_PASSWORD`, `API_KEY`; `eval(req.query.expression)` (code injection); `new Buffer()` (deprecated); logging secrets |
| `app.js`, `routes/auth.js`, `routes/user.js` | Same `checkAuth` logic duplicated 3 times; same hardcoded secret in multiple files |
| `routes/api.js` | SQL injection pattern (concatenating `req.query.id`); lodash `_.merge` prototype pollution risk; unsanitized `q` in response (XSS) |
| `routes/auth.js` | Hardcoded user/passwords; JWT with very long expiry; cookie without `secure`/`httpOnly` |
| `lib/db.js` | Hardcoded connection string; `buildUserQuery` builds query via string concatenation (injection) |
| `lib/fetch.js` | Deprecated `request`; SSRF (user-controlled URL); no timeout or TLS validation |
| `utils/helpers.js` | `new Buffer(str)`; `_.merge` with user input; duplicate `processUser` |
| `views/index.ejs` | User input in HTML/script without escaping (XSS) |

### Duplicate code

- `processUser()` in `routes/api.js`, `routes/user.js`, `utils/helpers.js`
- `checkAuth()` in `app.js`, `routes/auth.js`, `routes/user.js`
- `JWT_SECRET` repeated in `app.js`, `routes/auth.js`, `routes/user.js`

### Old / vulnerable dependencies (package.json)

- `lodash@4.17.15` – prototype pollution (e.g. CVE-2019-10744)
- `express@4.16.0` – older version; upgrade for security fixes
- `mongoose@5.7.0` – older version
- `request@2.88.0` – deprecated, unmaintained
- `node-sass@4.14.1` – deprecated; use `sass`
- `ejs@2.7.4` – older; upgrade for fixes
- `jsonwebtoken@8.5.0` – check for known CVEs

### Run

```bash
npm install
npm start
```

Use this project only for testing analyzers and learning what to avoid.
