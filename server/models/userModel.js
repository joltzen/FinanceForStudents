const db = require("../config/db");
const bcrypt = require("bcrypt");

const getAllUsers = async () => {
  try {
    const result = await db.query("SELECT * FROM users");
    return result.rows;
  } catch (error) {
    console.log(error);
  }
};

const updateUser = async (id, user) => {
  try {
    const { name, email } = user;
    const result = await db.query(
      "UPDATE users SET name=$1, email=$2 WHERE id=$3 RETURNING *",
      [name, email, id]
    );
    return result.rows[0];
  } catch (error) {
    console.log(error);
  }
};

const getUserById = async (id) => {
  try {
    const result = await db.query("SELECT * FROM users WHERE id = $1", [id]);
    return result.rows[0];
  } catch (error) {
    console.log(error);
  }
};



const findUserByUsernameOrEmail = async (identifier) => {
  try {
    const result = await db.query(
      "SELECT * FROM users WHERE username = $1 OR email = $1",
      [identifier]
    );
    return result.rows[0];
  } catch (error) {
    console.log(error);
  }
};
const createUser = async (user) => {
  try {
    const { username, email, password, firstname, surname } = user;
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await db.query(
      "INSERT INTO users (username, email, password, firstname, surname, thememode) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [username, email, hashedPassword, firstname, surname, "dark"]
    );

    return result.rows[0];
  } catch (error) {
    console.error("Error creating user:", error);
    throw error; // Throw the error so it can be caught by the caller
  }
};

const deleteUser = async (id) => {
  try {
    await db.query("BEGIN");

    const tablesToDeleteFrom = [
      "transactions",
      "categories",
      "saving_goals",
      "settings",
    ];

    for (const tableName of tablesToDeleteFrom) {
      await db.query(`DELETE FROM ${tableName} WHERE user_id = $1`, [id]);
    }

    const deleteUserResult = await db.query("DELETE FROM users WHERE id = $1", [
      id,
    ]);

    if (deleteUserResult.rowCount === 0) {
      await db.query("ROLLBACK");
      throw new Error("User not found");
    }

    await db.query("COMMIT");
  } catch (error) {
    await db.query("ROLLBACK");
    throw error;
  }
};
module.exports = {
  getAllUsers,
  createUser,
  updateUser,
  getUserById,
  deleteUser,
  findUserByUsernameOrEmail,
};
