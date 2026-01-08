require("dotenv").config();
const User = require("../models/User");
const validator = require("validator");

// GET PROFILE
exports.getProfile = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    return res.status(200).json({
      message: "Profile fetched",
      data: req.user,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

// UPDATE PROFILE
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user._id;

    // Allow only selected fields to update
    const allowedUpdates = [
      "name",
      "gender",
      "age",
      "skills",
      "headline",
      "about",
      "location",
    ];
    const payload = {};

    Object.keys(req.body).forEach((field) => {
      if (allowedUpdates.includes(field)) payload[field] = req.body[field];
    });

    // Validate name
    if (payload.name && payload.name.trim().length < 2) {
      return res
        .status(400)
        .json({ message: "Name must be at least 2 characters" });
    }

    // Validate skills
    if (payload.skills && !Array.isArray(payload.skills)) {
      return res.status(400).json({ message: "Skills must be an array" });
    }

    const updatedUser = await User.findByIdAndUpdate(userId, payload, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      message: "Profile updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.error("Update Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// DELETE PROFILE
// exports.deleteProfile = async (req, res) => {
//   try {
//     const userId = req.user._id;
//     const deletedUser = await User.findByIdAndDelete(userId);

//     if (!deletedUser) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     return res.status(200).json({
//       message: "Account deleted successfully",
//     });
//   } catch (error) {
//     console.error("Delete Error:", error);
//     return res.status(500).json({ message: "Server error" });
//   }
// };

// CHANGE PASSWORD
exports.changePassword = async (req, res) => {
  try {
    const user = req.user;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        message: "Current and new password are required",
      });
    }

    // Validate current password
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ message: "Current password is incorrect" });
    }

    // Strong password check
    if (!validator.isStrongPassword(newPassword)) {
      return res.status(400).json({ message: "New password is weak" });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    return res.status(200).json({
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error("Change Password Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
