/* Copyright (c) 2026, Jason Oltzen */

import express, { Request, Response } from "express";
import db from "./db";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import nodemailer from "nodemailer";

const router = express.Router();

// Get-Methods
router.get("/getUserData", (req: Request, res: Response) => {
  db.query("SELECT * FROM users", (err, result) => {
    if (err) {
      console.error("Fehler bei der Abfrage:", err);
      res.status(500).json({ error: "Datenbankfehler" });
    } else {
      res.json(result.rows);
    }
  });
});

router.get("/getThemeMode", async (req: Request, res: Response) => {
  try {
    const { userId } = req.query;
    const result = await db.query("SELECT thememode FROM users WHERE id = $1", [
      userId,
    ]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({ themeMode: result.rows[0].themeMode });
  } catch (error) {
    console.error("Error retrieving theme mode:", error);
    res.status(500).json({ error: "Error retrieving theme mode" });
  }
});

router.get("/getTransactions", async (req: Request, res: Response) => {
  try {
    const { month, year, user_id } = req.query;
    const result = await db.query(
      "SELECT * FROM transactions WHERE EXTRACT(MONTH FROM transaction_date) = $1 AND EXTRACT(YEAR FROM transaction_date) = $2 AND user_id = $3",
      [month, year, user_id],
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Error getting user transactions:", error);
    res.status(500).json({ error: "Error fetching transactions" });
  }
});

router.get("/getAllTransactions", async (req: Request, res: Response) => {
  try {
    const { user_id } = req.query;
    const result = await db.query(
      "SELECT * FROM transactions WHERE user_id = $1",
      [user_id],
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Error getting user transactions:", error);
    res.status(500).json({ error: "Error fetching transactions" });
  }
});

router.get("/getTransactionsAnnual", async (req: Request, res: Response) => {
  try {
    const { year, user_id } = req.query;
    const result = await db.query(
      "SELECT * FROM transactions WHERE EXTRACT(YEAR FROM transaction_date) = $1 AND user_id = $2",
      [year, user_id],
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Error getting user transactions:", error);
    res.status(500).json({ error: "Error fetching all transactions" });
  }
});

router.get("/get-saving-goals", async (req: Request, res: Response) => {
  try {
    const { userId } = req.query;
    const result = await db.query(
      "SELECT * FROM saving_goals WHERE user_id = $1",
      [userId],
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching saving goals:", error);
    res.status(500).json({ error: "Error fetching saving goals" });
  }
});

router.get("/getCategories", async (req: Request, res: Response) => {
  try {
    const { user_id } = req.query;
    const result = await db.query(
      "SELECT * FROM categories WHERE user_id = $1",
      [user_id],
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Error getting user transactions:", error);
    res.status(500).json({ error: "Error fetching transactions" });
  }
});

router.get("/getFavorites", async (req: Request, res: Response) => {
  try {
    const { user_id } = req.query;
    const result = await db.query(
      "SELECT * FROM favorites WHERE user_id = $1",
      [user_id],
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Error getting user transactions:", error);
    res.status(500).json({ error: "Error fetching transactions" });
  }
});

router.get("/getSettings", async (req: Request, res: Response) => {
  try {
    const { month, year, user_id } = req.query;
    const result = await db.query(
      "SELECT * FROM settings WHERE month = $1 AND year= $2 AND user_id = $3",
      [month, year, user_id],
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Error getting user settings:", error);
    res.status(500).json({ error: "Error fetching settings" });
  }
});

router.get("/getAllSettings", async (req: Request, res: Response) => {
  try {
    const { user_id } = req.query;
    const result = await db.query("SELECT * FROM settings WHERE user_id = $1", [
      user_id,
    ]);
    res.json(result.rows);
  } catch (error) {
    console.error("Error getting user settings:", error);
    res.status(500).json({ error: "Error fetching settings" });
  }
});

router.get("/getSettingsAnnual", async (req: Request, res: Response) => {
  try {
    const { year, user_id } = req.query;
    const result = await db.query(
      "SELECT * FROM settings WHERE year= $1 AND user_id = $2",
      [year, user_id],
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Error getting user settings:", error);
    res.status(500).json({ error: "Error fetching settings" });
  }
});

// Post-Methods
router.post("/login", async (req: Request, res: Response) => {
  try {
    const { identifier, password } = req.body;
    const user = await findUserByLogin(identifier);
    if (user) {
      const validPassword = await bcrypt.compare(password, user.password);
      if (validPassword) {
        res.status(200).send(user);
      } else {
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

router.post("/signup", async (req: Request, res: Response) => {
  try {
    const { username, email, password, firstname, surname } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    db.query(
      "INSERT INTO users (username, email, password, firstname, surname, thememode) VALUES ($1, $2, $3, $4, $5, $6)",
      [username, email, hashedPassword, firstname, surname, "dark"],
      (err) => {
        if (err) {
          console.error("Error inserting data:", err);
          return res.status(500).json({ error: "Error creating user" });
        }
        res.status(201).send("User created successfully");
      },
    );
  } catch (error) {
    console.error("Error in signup process:", error);
    res.status(500).send("Error creating user");
  }
});

router.post("/addTransaction", async (req: Request, res: Response) => {
  try {
    const {
      date,
      description,
      amount,
      transactionType,
      user_id,
      category_id,
      isFavorite,
    } = req.body;
    const query = `
      INSERT INTO transactions (user_id, transaction_type, amount, description, transaction_date, category_id, favorites)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *;`;
    const values = [user_id, transactionType, amount, description, date, category_id, isFavorite];
    db.query(query, values, (err, result) => {
      if (err) {
        console.error("Fehler beim Einfügen der Transaktion:", err);
        return res.status(500).json({ error: "Fehler beim Einfügen der Transaktion" });
      }
      res.status(201).json(result.rows[0]);
    });
  } catch (error) {
    console.error("Fehler beim Hinzufügen der Transaktion:", error);
    res.status(500).json({ error: "Fehler beim Hinzufügen der Transaktion" });
  }
});

router.post("/saveCategory", async (req: Request, res: Response) => {
  try {
    const { name, user_id, color, max_amount } = req.body;
    const query = `
      INSERT INTO categories (name, user_id, color, max)
      VALUES ($1, $2, $3, $4)
      RETURNING *;`;
    const values = [name, user_id, color, max_amount];
    db.query(query, values, (err, result) => {
      if (err) {
        console.error("Fehler beim Einfügen der Kategorie:", err);
        return res.status(500).json({ error: "Fehler beim Einfügen der Kategorie" });
      }
      res.status(201).json(result.rows[0]);
    });
  } catch (error) {
    console.error("Fehler beim Hinzufügen der Kategorie:", error);
    res.status(500).json({ error: "Fehler beim Hinzufügen der Kategorie" });
  }
});

router.post("/addSettings", async (req: Request, res: Response) => {
  try {
    const { user_id, transactionType, amount, description, month, year } = req.body;
    const query = `
      INSERT INTO settings (user_id, transaction_type, amount, description, month, year)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;`;
    const values = [user_id, transactionType, amount, description, month, year];
    db.query(query, values, (err, result) => {
      if (err) {
        console.error("Fehler beim Einfügen der Settings:", err);
        return res.status(500).json({ error: "Fehler beim Einfügen der Settings" });
      }
      res.status(201).json(result.rows[0]);
    });
  } catch (error) {
    console.error("Fehler beim Hinzufügen der Settings:", error);
    res.status(500).json({ error: "Fehler beim Hinzufügen der Settings" });
  }
});

router.post("/password-reset-request", async (req: Request, res: Response) => {
  const { email } = req.body;
  const passwordResetToken = uuidv4();
  const transporter = nodemailer.createTransport({});
  const mailOptions = {
    from: "financeforstudents@noreply.com",
    to: email,
    subject: "Password Reset",
    text: `Please use the following link to reset your password: http://localhost:3000/password/${passwordResetToken}`,
  };
  try {
    await transporter.sendMail(mailOptions);
    res.send("Password reset link sent.");
  } catch (error) {
    res.status(500).send("Error sending password reset email.");
  }
});

router.post("/reset-password", async (req: Request, res: Response) => {
  const { token, newPassword } = req.body;
  try {
    const user = await db.query(
      "SELECT user_id FROM password_reset WHERE token = $1",
      [token],
    );
    if (user.rows.length === 0) {
      return res.status(400).send("Invalid or expired password reset token");
    }
    const userId = user.rows[0].user_id;
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await db.query("UPDATE users SET password = $1 WHERE id = $2", [hashedPassword, userId]);
    await db.query("DELETE FROM password_reset WHERE token = $1", [token]);
    res.send("Password has been successfully reset");
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).send("Error resetting password");
  }
});

router.post("/saving-goals", async (req: Request, res: Response) => {
  try {
    const { userId, monthly_saving, total_amount, description, startdate, deadline, duration } = req.body;
    const newSavingGoal = await insertSavingGoal(
      userId, monthly_saving, total_amount, description, startdate, deadline, duration,
    );
    res.status(201).json(newSavingGoal);
  } catch (error) {
    console.error("Error inserting saving goal:", error);
    res.status(500).json({ error: "Error inserting saving goal" });
  }
});

router.post("/addFavorites", async (req: Request, res: Response) => {
  try {
    const { isOwn, description, amount, transactionType, user_id, category_id, transaction_id } = req.body;
    const query = `
      INSERT INTO favorites (user_id, transaction_type, amount, description, is_own, category_id, transaction_id)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *;`;
    const values = [user_id, transactionType, amount, description, isOwn, category_id, transaction_id];
    db.query(query, values, (err, result) => {
      if (err) {
        console.error("Fehler beim Einfügen der Favoriten:", err);
        return res.status(500).json({ error: "Fehler beim Einfügen der Favoriten" });
      }
      res.status(201).json(result.rows[0]);
    });
  } catch (error) {
    console.error("Fehler beim Hinzufügen der Favoriten:", error);
    res.status(500).json({ error: "Fehler beim Hinzufügen der Favoriten" });
  }
});

// Patch-Methods
router.patch("/updateCategory", async (req: Request, res: Response) => {
  try {
    const { id, name, color, max_amount } = req.body;
    const query = `
      UPDATE categories
      SET name = $1, color = $2, max = $3
      WHERE id = $4
      RETURNING *;`;
    const values = [name, color, max_amount, id];
    const result = await db.query(query, values);
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: "Fehler beim Aktualisieren der Kategorie" });
  }
});

router.patch("/updateThemeMode", async (req: Request, res: Response) => {
  try {
    const { userId, themeMode } = req.body;
    await db.query("UPDATE users SET thememode = $1 WHERE id = $2", [themeMode, userId]);
    res.status(200).json({ message: "Theme mode updated successfully." });
  } catch (error) {
    console.error("Error updating theme mode:", error);
    res.status(500).json({ error: "Error updating theme mode" });
  }
});

router.patch("/updateUser", async (req: Request, res: Response) => {
  try {
    const { firstname, surname, username, email, userId, admin } = req.body;
    let query = "UPDATE users SET";
    const values: any[] = [];
    const setClause: string[] = [];
    if (firstname !== undefined) { values.push(firstname); setClause.push(` firstname = $${values.length}`); }
    if (surname !== undefined) { values.push(surname); setClause.push(` surname = $${values.length}`); }
    if (username !== undefined) { values.push(username); setClause.push(` username = $${values.length}`); }
    if (email !== undefined) { values.push(email); setClause.push(` email = $${values.length}`); }
    if (admin !== undefined) { values.push(admin); setClause.push(` admin = $${values.length}`); }
    query += setClause.join(",");
    values.push(userId);
    query += ` WHERE id = $${values.length} RETURNING *;`;
    if (values.length === 1) {
      return res.status(400).json({ error: "No fields provided for update" });
    }
    const result = await db.query(query, values);
    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error updating user" });
  }
});

router.patch("/update-saving-goal", async (req: Request, res: Response) => {
  try {
    const { id, monthly_saving, total_amount, description, deadline } = req.body;
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

router.patch("/updateTransaction", async (req: Request, res: Response) => {
  try {
    const { transaction_id, transaction_type, amount, description, transaction_date } = req.body;
    const query = `
      UPDATE transactions
      SET amount = $1, description = $2, transaction_date = $3, transaction_type = $4
      WHERE transaction_id = $5
      RETURNING *;`;
    const values = [amount, description, transaction_date, transaction_type, transaction_id];
    const result = await db.query(query, values);
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error updating transaction:", error);
    res.status(500).json({ error: "Error updating transaction" });
  }
});

router.patch("/updateSettings", async (req: Request, res: Response) => {
  try {
    const { settings_id, transaction_type, amount, description, month, year } = req.body;
    const query = `
      UPDATE settings
      SET transaction_type = $1, amount = $2, description = $3, month = $4, year = $5
      WHERE settings_id = $6
      RETURNING *;`;
    const values = [transaction_type, amount, description, month, year, settings_id];
    const result = await db.query(query, values);
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error updating settings:", error);
    res.status(500).json({ error: "Error updating transaction" });
  }
});

router.patch("/updateFavorites", async (req: Request, res: Response) => {
  try {
    const { favorites_id, transaction_type, amount, description, category_id } = req.body;
    const query = `
      UPDATE favorites
      SET amount = $1, description = $2, transaction_type = $3, category_id = $4
      WHERE favorites_id = $5
      RETURNING *;`;
    const values = [amount, description, transaction_type, category_id, favorites_id];
    const result = await db.query(query, values);
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error updating transaction:", error);
    res.status(500).json({ error: "Error updating transaction" });
  }
});

router.patch("/setTransactionFavorite", async (req: Request, res: Response) => {
  try {
    const { transaction_id, isFavorite } = req.body;
    const query = `
      UPDATE transactions
      SET favorites= $1
      WHERE transaction_id = $2
      RETURNING *;`;
    const values = [isFavorite, transaction_id];
    const result = await db.query(query, values);
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error updating transaction:", error);
    res.status(500).json({ error: "Error updating transaction" });
  }
});

// Delete-Methods
router.delete("/deleteCategory", async (req: Request, res: Response) => {
  try {
    const { id } = req.query;
    const result = await db.query("DELETE FROM categories WHERE id = $1 RETURNING *;", [id]);
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: "Fehler beim Löschen der Kategorie" });
  }
});

router.delete("/deleteSettings", async (req: Request, res: Response) => {
  try {
    const { id } = req.query;
    const result = await db.query("DELETE FROM settings WHERE settings_id = $1 RETURNING *;", [id]);
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: "Fehler beim Löschen der Settings" });
  }
});

router.delete("/delete-account", async (req: Request, res: Response) => {
  const { userId } = req.query;
  if (!userId) {
    return res.status(400).send("User ID is required");
  }
  try {
    await db.query("BEGIN");
    const tablesToDeleteFrom = ["transactions", "categories", "saving_goals", "settings"];
    for (const tableName of tablesToDeleteFrom) {
      await db.query(`DELETE FROM ${tableName} WHERE user_id = $1`, [userId]);
    }
    const deleteUserResult = await db.query("DELETE FROM users WHERE id = $1", [userId]);
    if (deleteUserResult.rowCount === 0) {
      await db.query("ROLLBACK");
      return res.status(404).send("User not found");
    }
    await db.query("COMMIT");
    res.status(204).send();
  } catch (error) {
    await db.query("ROLLBACK");
    console.error("Error deleting account:", error);
    res.status(500).send("Error deleting account");
  }
});

router.delete("/deleteTransaction", async (req: Request, res: Response) => {
  try {
    const { id } = req.query;
    const result = await db.query(
      "DELETE FROM transactions WHERE transaction_id = $1 RETURNING *;",
      [id],
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: "Fehler beim Löschen der Transaction" });
  }
});

router.delete("/delete-saving-goal", async (req: Request, res: Response) => {
  try {
    const { id } = req.query;
    const result = await db.query("DELETE FROM saving_goals WHERE id = $1 returning *;", [id]);
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: "Fehler beim Löschen des Sparziels" });
  }
});

router.delete("/deleteFavorites", async (req: Request, res: Response) => {
  try {
    const { id } = req.query;
    const result = await db.query("DELETE FROM favorites WHERE favorites_id = $1 RETURNING *;", [id]);
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: "Fehler beim Löschen der Favoriten" });
  }
});

router.delete("/deleteFavoritesByTransaction", async (req: Request, res: Response) => {
  try {
    const { id } = req.query;
    const result = await db.query(
      "DELETE FROM favorites WHERE transaction_id = $1 RETURNING *;",
      [id],
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: "Fehler beim Löschen der Favoriten" });
  }
});

// Help functions
const findUserByLogin = async (login: string) => {
  const result = await db.query(
    "SELECT * FROM users WHERE username = $1 OR email = $1",
    [login],
  );
  return result.rows[0];
};

async function insertSavingGoal(
  userId: string,
  monthlySaving: number,
  totalAmount: number,
  description: string,
  startdate: string,
  deadline: string,
  duration: number,
) {
  const query = `
    INSERT INTO saving_goals (user_id, monthly_saving, total_amount, description, startdate, deadline, duration)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *;`;
  const values = [userId, monthlySaving, totalAmount, description, startdate, deadline, duration];
  const result = await db.query(query, values);
  return result.rows[0];
}

export default router;
