const express = require("express");
const router = express.Router();
const db = require("./db"); // Import the database module
const bcrypt = require("bcrypt");

router.get("/getData", (req, res) => {
  db.query("SELECT * FROM users", (err, result) => {
    if (err) {
      console.error("Fehler bei der Abfrage:", err);
      res.status(500).json({ error: "Datenbankfehler" });
    } else {
      res.json(result.rows);
    }
  });
});

router.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    db.query(
      "INSERT INTO users (username, email, password) VALUES ($1, $2, $3)",
      [username, email, hashedPassword],
      (err, result) => {
        if (err) {
          console.error("Error inserting data:", err);
          return res.status(500).json({ error: "Error creating user" });
        }
        res.status(201).send("User created successfully");
      }
    );
  } catch (error) {
    console.error("Error in signup process:", error);
    res.status(500).send("Error creating user");
  }
});
// In your routes file (e.g., routes.js)

router.post("/login", async (req, res) => {
  const { login, password } = req.body;

  try {
    // Check if login is username or email
    const user = await findUserByLogin(login); // Implement this function based on your DB schema

    if (user && (await bcrypt.compare(password, user.password))) {
      // User authenticated successfully
      // Generate and return JWT or any other post-login logic
      res.status(200).send("User logged in successfully");
    } else {
      res.status(401).send("Invalid login credentials");
    }
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).send("Error logging in user");
  }
});

// Helper function to find user by username or email
const findUserByLogin = async (login) => {
  // Replace this logic with your database query
  // For example:
  return db.query("SELECT * FROM users WHERE username = $1 OR email = $1", [
    login,
  ]);
};

module.exports = router;
