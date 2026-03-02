/**
 * BUGGY DB - SQL injection pattern, hardcoded connection, no escaping
 */
// SECURITY: Hardcoded connection string with password
const CONNECTION_STRING = 'mongodb://admin:admin123@localhost:27017/mydb';

function buildUserQuery(filters) {
  // SECURITY: String concatenation for query - SQL/NoSQL injection risk
  let query = 'SELECT * FROM users WHERE 1=1';
  if (filters.id) query += ` AND id = ${filters.id}`;
  if (filters.name) query += ` AND name = '${filters.name}'`;
  if (filters.email) query += ` AND email = '${filters.email}'`;
  return query;
}

function getConnection() {
  return CONNECTION_STRING;
}

module.exports = { buildUserQuery, getConnection };
