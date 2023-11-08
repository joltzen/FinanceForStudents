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

router.get("/getUserTransactionsAnnual", async (req, res) => {
  try {
    const { year, user_id } = req.query;
    const result = await db.query(
      "SELECT * FROM transactions WHERE EXTRACT(YEAR FROM transaction_date) = $1 AND user_id = $2",
      [year, user_id]
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Error getting user transactions:", error);
    res.status(500).json({ error: "Error fetching all transactions" });
  }
});
router.delete("/deleteTransaction", async (req, res) => {
  try {
    const { id } = req.query;
    const query =
      "DELETE FROM transactions WHERE transaction_id = $1 RETURNING *;";
    const values = [id];
    const result = await db.query(query, values);
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: "Fehler beim Löschen der Transaction" });
  }
});

// POST-Anforderung, um eine neue Transaktion hinzuzufügen
router.post("/addTransaction", async (req, res) => {
  try {
    const { date, description, amount, transactionType, user_id, category_id } =
      req.body;
    console.log(category_id);
    const query = `
      INSERT INTO transactions (user_id, transaction_type, amount, description, transaction_date, category_id)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;`;

    const values = [
      user_id,
      transactionType,
      amount,
      description,
      date,
      category_id,
    ];

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

router.patch("/updateCategory", async (req, res) => {
  try {
    const { id, name, color } = req.body;
    const query = `
      UPDATE categories
      SET name = $1, color = $2
      WHERE id = $3
      RETURNING *;`;

    const values = [name, color, id];
    const result = await db.query(query, values);
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: "Fehler beim Aktualisieren der Kategorie" });
  }
});

router.delete("/deleteCategory", async (req, res) => {
  try {
    const { id } = req.query;
    const query = "DELETE FROM categories WHERE id = $1 RETURNING *;";
    const values = [id];
    const result = await db.query(query, values);
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: "Fehler beim Löschen der Kategorie" });
  }
});

router.post("/addSettings", async (req, res) => {
  try {
    const { user_id, transactionType, amount, description, month, year } =
      req.body;
    const query = `
      INSERT INTO settings (user_id, transaction_type, amount, description, month, year)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;`;

    const values = [user_id, transactionType, amount, description, month, year];

    db.query(query, values, (err, result) => {
      if (err) {
        console.error("Fehler beim Einfügen der Settings:", err);
        return res
          .status(500)
          .json({ error: "Fehler beim Einfügen der Settings" });
      }
      const insertedSettings = result.rows[0];
      res.status(201).json(insertedSettings);
    });
  } catch (error) {
    console.error("Fehler beim Hinzufügen der Settings:", error);
    res.status(500).json({ error: "Fehler beim Hinzufügen der Settings" });
  }
});

router.get("/getSettings", async (req, res) => {
  try {
    const { month, year, user_id } = req.query;
    const result = await db.query(
      "SELECT * FROM settings WHERE month = $1 AND year= $2 AND user_id = $3",
      [month, year, user_id]
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Error getting user settings:", error);
    res.status(500).json({ error: "Error fetching settings" });
  }
});
router.get("/getSettingsAnnual", async (req, res) => {
  try {
    const { year, user_id } = req.query;
    const result = await db.query(
      "SELECT * FROM settings WHERE year= $1 AND user_id = $2",
      [year, user_id]
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Error getting user settings:", error);
    res.status(500).json({ error: "Error fetching settings" });
  }
});
router.delete("/deleteSettings", async (req, res) => {
  try {
    const { id } = req.query;
    const query = "DELETE FROM settings WHERE settings_id = $1 RETURNING *;";
    const values = [id];
    const result = await db.query(query, values);
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: "Fehler beim Löschen der Settings" });
  }
});

module.exports = router;
