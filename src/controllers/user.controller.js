const User = require("../models/User");
const validator = require("validator");

/**
 * SIGN UP (ONLY WAY TO CREATE USER)
 */
exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // REQUIRED FIELD CHECK
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "All required fields must be provided",
      });
    }

    // EMAIL VALIDATION
    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // PASSWORD VALIDATION
    if (
      !validator.isStrongPassword(password, {
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
    ) {
      return res.status(400).json({
        message:
          "Password must be at least 8 characters and include upper, lower, number & symbol",
      });
    }

    // CREATE USER
    const user = await User.create({
      name: validator.escape(name.trim()),
      email: email.toLowerCase(),
      password,
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
    if (error.code === 11000) {
      return res.status(409).json({ message: "Email already exists" });
    }
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * GET SINGLE USER
 */
exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(400).json({ message: "Invalid user ID" });
  }
};

/**
 * UPDATE USER (PROFILE)
 */
exports.updateUser = async (req, res) => {
  try {
    const ALLOWED_UPDATES = ["name"];
    const updates = Object.keys(req.body);

    const isValidOperation = updates.every((field) =>
      ALLOWED_UPDATES.includes(field)
    );

    if (!isValidOperation) {
      return res.status(400).json({ message: "Invalid update fields" });
    }

    if (req.body.name) {
      if (!validator.isLength(req.body.name, { min: 2, max: 20 })) {
        return res
          .status(400)
          .json({ message: "Name must be 2–20 characters" });
      }
      req.body.name = validator.escape(req.body.name.trim());
    }

    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: "Profile updated successfully",
      data: user,
    });
  } catch (error) {
    res.status(400).json({ message: "Update failed" });
  }
};

/**
 * DELETE USER
 */
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: "Invalid user ID" });
  }
};

/**
 * GET USERS (EMAIL SEARCH OR FEED)
 */
exports.getUsers = async (req, res) => {
  try {
    const { email } = req.query;

    // SEARCH BY EMAIL
    if (email) {
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      return res.json({ message: "User found", user });
    }

    // FEED
    const users = await User.find({});

    res.json({
      message: "Users fetched successfully",
      users,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
