require("dotenv").config();
const User = require("../models/User");
const validator = require("validator");

/**
 * SIGN UP
 */
exports.signup = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      gender,
      age,
      skills,
      headline,
      about,
      location,
    } = req.body;

    // Required fields
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Name, email & password are required" });
    }

    // Email format
    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // Password validation
    if (!validator.isStrongPassword(password)) {
      return res.status(400).json({
        message:
          "Password must be strong (min 8 chars, symbols, upper/lower case, numbers)",
      });
    }

    // Check existing user before creating
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({ message: "Email already registered" });
    }

    // Create user
    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase(),
      password,
      gender,
      age,
      skills,
      headline,
      about,
      location,
    });

    return res.status(201).json({ message: `${name} signup successfully` });
  } catch (error) {
    console.error("Signup Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * LOGIN
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Required
    if (!email || !password) {
      return res.status(400).json({ message: "Enter email & password" });
    }

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() }).select(
      "+password"
    );
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // Verify password
    const passwordMatch = await user.comparePassword(password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // JWT
    const token = await user.getJWT();

    // Secure cookie
    res.cookie("token", token, {
      maxAge: 8 * 3600000,
    });

    // Success response
    return res.status(200).json({
      message: `${user.name} Login successful`,
    });
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * LOG-OUT
 */
exports.logout = (req, res) => {
  res.cookie("token", "", { expires: new Date(0) });
  return res.status(200).json({
    message: "Logout successful",
  });
};
