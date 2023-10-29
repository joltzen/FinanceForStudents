const config = require("./config");
const { Pool } = require("pg");

const pool = new Pool({
  user: config.database.user,
  host: config.database.host,
  database: config.database.database,
  password: config.database.password,
  port: config.database.port,
});

module.exports = pool;
