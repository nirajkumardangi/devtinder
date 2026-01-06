require("dotenv").config();
const User = require("../models/User");
const validator = require("validator");
const jwt = require("jsonwebtoken");

/**
 * GET SINGLE USER
 */
exports.getUser = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await User.findById(req.user._id).select("name email");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      data: user,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

/**
 * UPDATE USER (PROFILE)
 */
exports.updateUser = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Verify allowed update
    const ALLOWED_UPDATES = ["name"];
    const updates = Object.keys(req.body);

    const isValidOperation = updates.every((field) =>
      ALLOWED_UPDATES.includes(field)
    );

    if (!isValidOperation) {
      return res.status(400).json({ message: "Invalid update fields" });
    }

    if (req.body.name.trim()) {
      if (!validator.isLength(req.body.name, { min: 2, max: 20 })) {
        return res
          .status(400)
          .json({ message: "Name must be 2–20 characters" });
      }
      req.body.name = validator.escape(req.body.name.trim());
    }

    const user = await User.findByIdAndUpdate(req.user._id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: "Profile updated successfully",
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};

/**
 * DELETE USER
 */
exports.deleteUser = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await User.findByIdAndDelete(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: "Unauthorized" });
  }
};

/**
 * GET USERS (BY EMAIL/NAME SEARCH OR FEED)
 */
exports.getUsers = async (req, res) => {
  try {
    const { email, name } = req.query;

    const filter = {};

    if (email) filter.email = email.toLowerCase();
    if (name) filter.name = { $regex: name, $options: "i" };

    const users = await User.find(filter)
      .select("email name") // include these fields
      .collation({ locale: "en", strength: 2 }) // case-insensitive sort
      .sort({ name: 1 }); // simple sort

    if (users.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }

    res.json({
      message: "Users fetched successfully",
      users,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
