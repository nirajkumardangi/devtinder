require("dotenv").config();
const User = require("../models/UserSchema");
const validator = require("validator");

// GET PROFILE
exports.getProfile = async (req, res) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    res.status(200).json({
      data: user,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

// UPDATE PROFILE
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user._id;

    // Verify allowed update
    const ALLOWED_UPDATES = ["name"];
    const updates = Object.keys(req.body);

    if (updates.length === 0) {
      return res.status(400).json({
        message: "No fields provided for update",
      });
    }

    const isValidOperation = updates.every((field) =>
      ALLOWED_UPDATES.includes(field)
    );

    if (!isValidOperation) {
      return res.status(400).json({ message: "Invalid update fields" });
    }

    // Validate & sanitize name
    if (req.body.name !== undefined) {
      if (!validator.isLength(req.body.name.trim(), { min: 2, max: 20 })) {
        return res.status(400).json({
          message: "Name must be between 2 and 20 characters",
        });
      }

      req.body.name = validator.escape(req.body.name.trim());
    }

    const updatedUser = await User.findByIdAndUpdate(userId, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: "Profile updated successfully",
      data: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
      },
    });
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};

// DELETE PROFILE
exports.deleteProfile = async (req, res) => {
  try {
    const userId = req.user._id;

    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
