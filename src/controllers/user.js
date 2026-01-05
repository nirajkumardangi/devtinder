const User = require("../models/User");
const validator = require("validator");

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
 * DYNAMIC SEARCH USING QUERY PARAMS
 * GET /users/search?firstName=Akshay&age=30
 */

exports.searchUser = async (req, res) => {
  try {
    console.log(req);
  } catch (err) {
    console.log(err);
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
      .sort({ name: 1 }) // simple sort

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
