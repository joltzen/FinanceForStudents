const express = require("express");
const app = express();
const PORT = process.env.PORT || 5432;
const cors = require("cors");

app.use(cors());
app.use(express.json());

const routes = require("./routes/routes");
app.use("/api", routes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
