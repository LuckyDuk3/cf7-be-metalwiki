const User = require('../models/user.model');
const { generateAccessToken, hashPassword, comparePassword } = require('../services/auth.service');

const registerUser = async (req, res) => {
  try {
    const { username, password, name, surname, email } = req.body;

    // Check if a user exists with the same username or email
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ message: "Username or email already exists" });
    }

    // Encrypt password using auth service
    const hashedPassword = await hashPassword(password);

    // Creation of new user
    const newUser = new User({
      username,
      password: hashedPassword,
      name,
      surname,
      email,
      roles: ['user'] // default role
    });

    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find user by username
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    // Check if password is matching using auth service
    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    // Generate JWT token using auth service
    const token = generateAccessToken({
      _id: user._id,
      username: user.username,
      email: user.email,
      roles: user.roles
    });

    // Return JWT token and username to the frontend
    res.json({ token, username: user.username });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { registerUser, loginUser };
