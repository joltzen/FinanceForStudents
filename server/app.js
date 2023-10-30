const express = require("express");
const app = express();
const port = 3001;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Import the 'cors' middleware
const cors = require("cors");

// Use the 'cors' middleware to enable CORS
app.use(cors());
app.use(express.json()); // This line is important!

const routes = require("./routes/routes");
app.use("/api", routes); // This defines the base path for your API routes

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

// app.post("/login", async (req, res) => {
//   // Implement login logic: fetch user, compare password, generate JWT
// });

module.exports = app;
