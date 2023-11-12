const express = require("express");
const router = express.Router();
const db = require("./db"); // Import the database module
const bcrypt = require("bcrypt");
const { map } = require("../app");
const { v4: uuidv4 } = require("uuid");
const nodemailer = require("nodemailer");

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
    if (user) {
      const validPassword = await bcrypt.compare(password, user.password);
      if (validPassword) {
        res.status(200).send(user);
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

router.post("/password-reset-request", async (req, res) => {
  const { email } = req.body;
  // Überprüfe, ob die E-Mail in der Datenbank existiert
  // Generiere Token und speichere es mit einem Ablaufdatum in der Datenbank
  const passwordResetToken = uuidv4();
  // Speichere das Token in deiner Datenbank zusammen mit dem Ablaufdatum
  // ...

  // Konfiguriere nodemailer mit deinen E-Mail-Einstellungen
  const transporter = nodemailer.createTransport({
    // ... E-Mail-Service-Konfiguration ...
  });

  const mailOptions = {
    from: "financeforstudents@noreply.com",
    to: email,
    subject: "Password Reset",
    text: `Please use the following link to reset your password: http://localhost:3000/password/${passwordResetToken}`,
  };

  try {
    // Sende die E-Mail
    await transporter.sendMail(mailOptions);
    res.send("Password reset link sent.");
  } catch (error) {
    res.status(500).send("Error sending password reset email.");
  }
});

router.post("/reset-password", async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    // Überprüfe das Token und hole die Benutzer-ID
    const user = await db.query(
      "SELECT user_id FROM password_reset WHERE token = $1",
      [token]
    );

    // Token nicht gefunden oder abgelaufen
    if (user.rows.length === 0) {
      return res.status(400).send("Invalid or expired password reset token");
    }

    const userId = user.rows[0].user_id;
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update das Passwort in der Datenbank
    await db.query("UPDATE users SET password = $1 WHERE id = $2", [
      hashedPassword,
      userId,
    ]);

    // Lösche das Token aus der Datenbank, da es nicht mehr benötigt wird
    await db.query("DELETE FROM password_reset WHERE token = $1", [token]);

    res.send("Password has been successfully reset");
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).send("Error resetting password");
  }
});

router.delete("/delete-account", async (req, res) => {
  const { userId } = req.body; // Oder holen Sie die Benutzer-ID aus dem Authentifizierungstoken

  try {
    // Lösche alle Benutzerdaten, hier nur als Beispiel für die users-Tabelle
    await db.query("DELETE FROM users WHERE id = $1", [userId]);

    // Hier sollten Sie alle anderen Daten löschen, die mit dem Benutzer verbunden sind

    res.send("Account has been successfully deleted");
  } catch (error) {
    console.error("Error deleting account:", error);
    res.status(500).send("Error deleting account");
  }
});

async function insertSavingGoal(
  userId,
  monthlySaving,
  totalAmount,
  description,
  startdate,
  deadline,
  duration
) {
  const query = `
    INSERT INTO saving_goals (user_id, monthly_saving, total_amount, description, startdate,deadline, duration)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *;`;
  const values = [
    userId,
    monthlySaving,
    totalAmount,
    description,
    startdate,
    deadline,
    duration,
  ];

  try {
    const result = await db.query(query, values);
    return result.rows[0];
  } catch (error) {
    throw error;
  }
}

router.post("/saving-goals", async (req, res) => {
  try {
    const {
      userId,
      monthly_saving,
      total_amount,
      description,
      startdate,
      deadline,
      duration,
    } = req.body;
    const newSavingGoal = await insertSavingGoal(
      userId,
      monthly_saving,
      total_amount,
      description,
      startdate,
      deadline,
      duration
    );
    res.status(201).json(newSavingGoal);
  } catch (error) {
    console.error("Error inserting saving goal:", error);
    res.status(500).json({ error: "Error inserting saving goal" });
  }
});

router.get("/get-saving-goals", async (req, res) => {
  try {
    const { userId } = req.query;
    const result = await db.query(
      "SELECT * FROM saving_goals WHERE user_id = $1",
      [userId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching saving goals:", error);
    res.status(500).json({ error: "Error fetching saving goals" });
  }
});

//delete saving goal
router.delete("/delete-saving-goal", async (req, res) => {
  try {
    const { id } = req.query;
    console.log(id);
    const query = "DELETE FROM saving_goals WHERE id = $1 returning *;";
    const values = [id];
    const result = await db.query(query, values);
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: "Fehler beim Löschen des Sparziels" });
  }
});

//edit saving goal
router.patch("/update-saving-goal", async (req, res) => {
  try {
    const { id, monthly_saving, total_amount, description, deadline } =
      req.body;
    const query = `
      UPDATE saving_goals
      SET monthly_saving = $1, total_amount = $2, description = $3, deadline = $4
      WHERE id = $5
      RETURNING *;`;

    const values = [monthly_saving, total_amount, description, deadline, id];
    const result = await db.query(query, values);
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: "Fehler beim Aktualisieren des Sparziels" });
  }
});

router.patch("/updateTransaction", async (req, res) => {
  try {
    const { transaction_id, amount, description, transaction_date } = req.body;

    const query = `
      UPDATE transactions
      SET amount = $1, description = $2, transaction_date = $4
      WHERE transaction_id = $3
      RETURNING *;`;

    const values = [amount, description, transaction_id, transaction_date];
    const result = await db.query(query, values);
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error updating transaction:", error);
    res.status(500).json({ error: "Error updating transaction" });
  }
});

module.exports = router;
