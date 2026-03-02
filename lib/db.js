/**
 * DB - connection from env, parameterized query building
 */
const config = require('../config');

function buildUserQuery(filters) {
  const conditions = [];
  const params = [];
  if (filters.id != null) {
    conditions.push('id = ?');
    params.push(filters.id);
  }
  if (filters.name != null) {
    conditions.push('name = ?');
    params.push(filters.name);
  }
  if (filters.email != null) {
    conditions.push('email = ?');
    params.push(filters.email);
  }
  const where = conditions.length ? ` WHERE ${conditions.join(' AND ')}` : '';
  return { query: `SELECT * FROM users${where}`, params };
}

function getConnection() {
  return config.dbConnectionString;
}

module.exports = { buildUserQuery, getConnection };
