const express = require("express");
const router = express.Router();
const db = require("./db"); // Import the database module
const bcrypt = require("bcrypt");
const { map } = require("../app");

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

router.post("/login", async (req, res) => {
  try {
    const { identifier, password } = req.body;
    const user = await findUserByLogin(identifier);
    console.log(user.id);
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

router.post("/signup", async (req, res) => {
  try {
    const { username, email, password, firstname, surname } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    db.query(
      "INSERT INTO users (username, email, password, firstname, surname) VALUES ($1, $2, $3, $4, $5)",
      [username, email, hashedPassword, firstname, surname],
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

router.get("/getUserTransactions", async (req, res) => {
  try {
    const { month, year, user_id } = req.query;
    const result = await db.query(
      "SELECT * FROM transactions WHERE EXTRACT(MONTH FROM transaction_date) = $1 AND EXTRACT(YEAR FROM transaction_date) = $2 AND user_id = $3",
      [month, year, user_id]
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Error getting user transactions:", error);
    res.status(500).json({ error: "Error fetching transactions" });
  }
});

// POST-Anforderung, um eine neue Transaktion hinzuzufügen
router.post("/addTransaction", async (req, res) => {
  try {
    const { date, description, amount, transactionType, user_id } = req.body;
    //const user_id = 8; // TODO: Hier muss die user_id aus dem JWT-Token ausgelesen werden
    const query = `
      INSERT INTO transactions (user_id, transaction_type, amount, description, transaction_date)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;`;

    const values = [user_id, transactionType, amount, description, date];

    db.query(query, values, (err, result) => {
      if (err) {
        console.error("Fehler beim Einfügen der Transaktion:", err);
        return res
          .status(500)
          .json({ error: "Fehler beim Einfügen der Transaktion" });
      }
      const insertedTransaction = result.rows[0];
      res.status(201).json(insertedTransaction);
    });
  } catch (error) {
    console.error("Fehler beim Hinzufügen der Transaktion:", error);
    res.status(500).json({ error: "Fehler beim Hinzufügen der Transaktion" });
  }
});

const findUserByLogin = async (login) => {
  const result = await db.query(
    "SELECT * FROM users WHERE username = $1 OR email = $1",
    [login]
  );
  return result.rows[0]; // Accessing the first row of the result
};

router.get("/getCategories", async (req, res) => {
  try {
    const { user_id } = req.query;
    console.log(user_id);
    const result = await db.query(
      "SELECT * FROM categories WHERE user_id = $1",
      [user_id]
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Error getting user transactions:", error);
    res.status(500).json({ error: "Error fetching transactions" });
  }
});
router.post("/saveCategory", async (req, res) => {
  try {
    const { name, user_id, color } = req.body;
    console.log(name, user_id, color);
    const query = `
      INSERT INTO categories (name, user_id, color)
      VALUES ($1, $2, $3)
      RETURNING *;`;

    const values = [name, user_id, color];
    db.query(query, values, (err, result) => {
      if (err) {
        console.error("Fehler beim Einfügen der Kategorie:", err);
        return res
          .status(500)
          .json({ error: "Fehler beim Einfügen der Kategorie" });
      }
      const insertedTransaction = result.rows[0];
      res.status(201).json(insertedTransaction);
    });
  } catch (error) {
    console.error("Fehler beim Hinzufügen der Kategorie:", error);
    res.status(500).json({ error: "Fehler beim Hinzufügen der Kategorie" });
  }
});

module.exports = router;
