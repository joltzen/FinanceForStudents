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
  try {
    const { identifier, password } = req.body;
    // Here you'd retrieve the user from the database based on the identifier
    // which could be either a username or an email.
    const user = await findUserByLogin(identifier);
    //print the user information
    if (user) {
      const validPassword = await bcrypt.compare(password, user.password);
      if (validPassword) {
        res.status(200).send(user);
        console.log("Correct password");
      } else {
        // Passwords don't match
        res.status(400).send("Invalid password");
      }
    } else {
      res.status(404).send("User not found");
    }
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).send("Error logging in user");
  }
});

// Helper function to find user by username or email
const findUserByLogin = async (login) => {
  const result = await db.query(
    "SELECT * FROM users WHERE username = $1 OR email = $1",
    [login]
  );
  return result.rows[0]; // Accessing the first row of the result
};

module.exports = router;
