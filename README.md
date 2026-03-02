# Test App (Issues Resolved)

Node.js app with security and code-quality issues addressed for SonarCloud/static analysis.

## Setup

1. Copy `.env.example` to `.env` and set values (never commit `.env`).
2. Required env vars:
   - `JWT_SECRET` – secret for signing JWTs
   - `MONGODB_URI` or `DATABASE_URL` – DB connection string
   - Optional: `AUTH_USERS` – JSON object `{"username":"password",...}` for `/auth/login`
   - Optional: `JWT_EXPIRY`, `PORT`, `API_KEY`, `NODE_ENV`

## Run

```bash
npm install
npm start
```

## Fixes applied

- **Secrets**: All passwords and API keys moved to environment variables via `config.js`.
- **eval**: Replaced with a safe math parser (no dynamic code execution).
- **Buffer**: Replaced `new Buffer()` with `Buffer.from()`.
- **path**: Using `node:path` instead of `path`.
- **Exceptions**: Auth `catch` blocks handle errors and return 401 (no empty catch).
- **Logging**: Removed logging of secrets.
- **api.js**: Removed unused `query` variable; user lookup without string concatenation.
- **lib/db.js**: Connection string from config; parameterized-style query building.
- **utils/helpers.js**: `parseInt` replaced with `Number.parseInt`; `Buffer.from` in `toBase64`.
