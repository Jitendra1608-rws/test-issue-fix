/**
 * Single source of user data. In-memory store; can be wired to lib/db.js when a database is configured.
 */

const inMemoryUsers = [
  { id: 1, name: 'Alice', email: 'alice@test.com', role: 'user' },
  { id: 2, name: 'Bob', email: 'bob@test.com', role: 'admin' },
];

function getUsers() {
  return inMemoryUsers;
}

function getUserById(id) {
  const users = getUsers();
  return users.find((u) => String(u.id) === String(id)) ?? null;
}

function findUsersBySearch(q) {
  if (!q || typeof q !== 'string') return getUsers();
  const lower = q.toLowerCase();
  return getUsers().filter(
    (u) =>
      (u.name?.toLowerCase() ?? '').includes(lower) ||
      (u.email?.toLowerCase() ?? '').includes(lower)
  );
}

module.exports = { getUsers, getUserById, findUsersBySearch };
