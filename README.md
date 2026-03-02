# Test App

Node.js app with shared middleware, helpers, and up-to-date dependencies. Secrets come from environment variables; user input is validated and sanitized.

## Setup

1. Copy `.env.example` to `.env` and set values (do not commit `.env`).
2. Required env vars:
   - `JWT_SECRET` – secret for signing JWTs
   - `MONGODB_URI` or `DATABASE_URL` – database connection (optional; app uses in-memory user data if not set)
   - Optional: `AUTH_USERS` – JSON object `{"username":"password",...}` for `/auth/login`
   - Optional: `JWT_EXPIRY`, `PORT`, `API_KEY`, `NODE_ENV`, `ALLOWED_FETCH_HOSTS` (comma-separated hosts for `lib/fetch.js`)

## Run

```bash
npm install
npm start
```

## Structure

- **middleware/auth.js** – shared `checkAuth` JWT middleware
- **utils/helpers.js** – `processUser`, `safeMerge` (prototype-pollution safe), `sanitizeForHtml`, `parseId`, `toBase64`
- **lib/users.js** – single source of user data (in-memory; can be wired to `lib/db.js` when a DB is configured)
- **lib/db.js** – parameterized query builder and connection config for when a database is used
- **lib/fetch.js** – HTTP client with URL allowlist (SSRF protection), timeout, and TLS validation

## Security and quality

- No hardcoded secrets; config via `config.js` and env.
- No `eval` or dynamic code execution; `/calc` uses a safe math parser.
- Auth uses shared middleware; JWT verified with proper error handling.
- Search and merge: user input sanitized (XSS); merge uses own-property-only to avoid prototype pollution.
- Fetch: only URLs whose host is in `ALLOWED_FETCH_HOSTS` (default: localhost, 127.0.0.1) are requested.
- Dependencies are current; deprecated `request` removed in favor of Node `http`/`https` with allowlist and timeout.
