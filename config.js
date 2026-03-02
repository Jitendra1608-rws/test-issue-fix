/**
 * Config from environment - no hardcoded secrets
 */
module.exports = {
  jwtSecret: process.env.JWT_SECRET,
  dbConnectionString: process.env.MONGODB_URI || process.env.DATABASE_URL,
  apiKey: process.env.API_KEY,
};
