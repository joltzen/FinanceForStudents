const express = require("express");
const app = express();
const PORT = process.env.PORT || 5432;
const cors = require("cors");
const path = require("path");

app.use(cors());
app.use(express.json());
const routes = require("./routes/routes");
app.use("/api", routes);

app.use(express.static(path.join(__dirname, "../client/build")));

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/build", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
