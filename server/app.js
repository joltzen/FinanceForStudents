const express = require("express");
const app = express();
const port = 3001;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const cors = require("cors");

app.use(cors());
app.use(express.json());

const routes = require("./routes/routes");
app.use("/api", routes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

module.exports = app;
