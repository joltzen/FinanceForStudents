const express = require("express");
const app = express();
const port = 3001;

// Serve API routes
app.get("/api", (req, res) => {
  res.json({ message: "Hello from Express!" });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

module.exports = app;
