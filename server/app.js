const express = require("express");
const app = express();
const port = 3001;

// Import the 'cors' middleware
const cors = require("cors");

// Use the 'cors' middleware to enable CORS
app.use(cors());

const routes = require("./routes/routes");
app.use("/api", routes); // This defines the base path for your API routes

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

module.exports = app;
