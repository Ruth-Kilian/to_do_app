const jwt = require("jsonwebtoken");
const User = require("../models/userSchema");

// Register a user
const register = async (req, res) => {
  // get data
  const { username, password } = req.body;

  try {
    // checks if username exists already
    const existingUser = await User.findOne({ username });

    // send back the res
    if (existingUser) {
      return res.status(409).json({ message: "Username already exists" });
    }

    // unique username -> user is created & saved
    const newUser = new User({ username, password });
    await newUser.save();

    res.json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// Login a user
const login = async (req, res) => {
  // get data
  const { username, password } = req.body;

  try {
    // searches for the user
    const user = await User.findOne({ username, password });

    // if user is not found
    if (!user) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    // JWT token is generated using the user's ID and secret key
    const token = jwt.sign({ userId: user._id }, "secretKey");

    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// Change password for a user
const changePassword = async (req, res) => {
  const { username, currentPassword, newPassword } = req.body;

  try {
    // Find the user by username and current password
    const user = await User.findOne({ username, password: currentPassword });

    // If user is not found or current password is incorrect
    if (!user) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    // Update the user's password with the new password
    user.password = newPassword;
    await user.save();

    res.json({ message: "Password changed successfully" });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { register, login, changePassword };
