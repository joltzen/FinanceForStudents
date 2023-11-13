const express = require("express");
const app = express();
const port = 5432;
//const port = 5432;
const cors = require("cors");

app.use(cors());
app.use(express.json());

const routes = require("./routes/routes");
app.use("/api", routes);

app.listen(5432, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

module.exports = app;
