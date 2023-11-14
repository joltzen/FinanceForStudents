const config = require("./config");
const { Pool } = require("pg");

if (process.env.NODE_ENV == "production") {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
    user: config.database.user,
    host: config.database.host,
    database: config.database.database,
    password: config.database.password,
    port: config.database.port,
  });
  module.exports = pool;
} else {
  const pool = new Pool({
    user: config.database.user,
    host: config.database.host,
    database: config.database.database,
    password: config.database.password,
    port: config.database.port,
  });
  module.exports = pool;
}
