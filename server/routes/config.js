module.exports = {
  database: {
    user: process.env.POSTGRES_USER || "your_username",
    host: process.env.POSTGRES_HOST || "your_host",
    database: process.env.POSTGRES_DATABASE || "your_database",
    password: process.env.POSTGRES_PASSWORD || "your_password",
    port: process.env.DB_PORT || 5432,
  },
};

// module.exports = {
//   database: {
//     user: process.env.DB_USER || "your_username",
//     host: process.env.DB_HOST || "your_host",
//     database: process.env.DB_NAME || "your_database",
//     password: process.env.DB_PASSWORD || "your_password",
//     port: process.env.DB_PORT || 5432,
//   },
// };
