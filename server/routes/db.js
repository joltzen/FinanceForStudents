const config = require("./config");
const { Pool } = require("pg");

const pool = new Pool({
  user: config.database.user,
  host: config.database.host,
  database: config.database.database,
  password: config.database.password,
  port: config.database.port,
  ssl: {
    rejectUnauthorized: false, // Für Produktionsumgebungen ist es besser, dies auf `true` zu setzen und die entsprechenden SSL-Zertifikate bereitzustellen.
  },
});

module.exports = pool;
