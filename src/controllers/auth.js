const User = require("../models/User");
const validator = require("validator");
const bcrypt = require("bcryptjs");

/**
 * SIGN UP
 */
exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "All required fields must be provided" });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    if (!validator.isStrongPassword(password)) {
      return res.status(400).json({ message: "Weak password" });
    }

    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase(),
      password, // 👈 plain password, model hashes it
    });

    res.status(201).json({
      message: "User signed up successfully",
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error(error);

    if (error.code === 11000) {
      return res.status(409).json({ message: "Email already exists" });
    }

    res.status(500).json({ message: "Server error" });
  }
};

/**
 * LOGIN
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Check for missing fields
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    // 2. Find user (normalize email)
    const user = await User.findOne({ email: email.toLowerCase() }).select(
      "+password"
    );

    // 3. Check if user exists
    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // 4. Verify password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // 5. Success response
    res.status(200).json({
      message: "Login successful",
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
