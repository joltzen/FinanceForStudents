const userModel = require("../models/userModel");

const getAllUserData = async (req, res) => {
  try {
    const users = await userModel.getAllUsers();
    res.json(users);
  } catch (error) {
    res.status(500).send("Error getting users data");
  }
};

const getUserData = async (req, res) => {
  try {
    const user = await userModel.getUserById(req.params.id);
    res.json(user);
  } catch (error) {
    res.status(500).send("Error getting user data");
  }
};

const registerUser = async (req, res) => {
  try {
    const newUser = await userModel.createUser(req.body);
    res.status(201).json(newUser);
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).send("Error registering user");
  }
};
const loginUser = async (req, res) => {
  try {
    const { identifier, password } = req.body;
    const user = await userModel.findUserByUsernameOrEmail(identifier);
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
    res.status(500).send("Error logging in");
  }
};

const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    await userModel.deleteUser(userId);
    res.status(200).send("User deleted successfully");
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).send("Error deleting user");
  }
};

module.exports = {
  getUserData,
  registerUser,
  loginUser,
  deleteUser,
};
