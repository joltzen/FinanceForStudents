const express = require("express");
const router = express.Router();
const db = require("./db"); // Import the database module

// Route to add an integer value to the table
// router.post("/addValue", (req, res) => {
//   const { value } = req.body;

//   // Perform the database update here
//   db.query("INSERT INTO test test VALUES ($1)", [value], (err, result) => {
//     if (err) {
//       console.error("Error updating the database:", err);
//       res.status(500).json({ error: "Database error" });
//     } else {
//       res.json({ message: "Value added to the table successfully" });
//     }
//   });

router.get("/getData", (req, res) => {
  db.query("SELECT * FROM test", (err, result) => {
    if (err) {
      console.error("Fehler bei der Abfrage:", err);
      res.status(500).json({ error: "Datenbankfehler" });
    } else {
      res.json(result.rows);
    }
  });
});

module.exports = router;
