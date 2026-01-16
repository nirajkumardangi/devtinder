require("dotenv").config();
const User = require("../models/User");
const validator = require("validator");

// GET PROFILE
exports.getProfile = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Profile fetched successfully",
      user: req.user,
    });
  } catch (error) {
    console.error("Profile Fetch Error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// UPDATE PROFILE
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user._id;

    const allowedUpdates = [
      "name",
      "gender",
      "age",
      "headline",
      "about",
      "skills",
      "avatar",
      "location",
      "social",
    ];

    const payload = {};
    for (const key of Object.keys(req.body)) {
      if (allowedUpdates.includes(key)) payload[key] = req.body[key];
    }

    // VALIDATIONS
    if (payload.name && payload.name.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: "Name must have at least 2 characters",
      });
    }

    if (payload.skills && !Array.isArray(payload.skills)) {
      return res
        .status(400)
        .json({ success: false, message: "Skills must be an array" });
    }

    if (payload.age && !Number.isInteger(payload.age)) {
      return res
        .status(400)
        .json({ success: false, message: "Age must be a number" });
    }

    // if (payload.social && typeof payload.social === "object") {
    //   for (const link of Object.values(payload.social)) {
    //     if (link && !validator.isURL(link, { require_protocol: true })) {
    //       return res.status(400).json({
    //         success: false,
    //         message: "Social links must be valid URLs",
    //       });
    //     }
    //   }
    // }

    const updatedUser = await User.findByIdAndUpdate(userId, payload, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Update Error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// CHANGE PASSWORD
exports.changePassword = async (req, res) => {
  try {
    const user = req.user;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Current and new password are required",
      });
    }

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Current password is incorrect" });
    }

    if (!validator.isStrongPassword(newPassword, { minSymbols: 1 })) {
      return res.status(400).json({
        success: false,
        message:
          "New password must be stronger (min: 8 chars, upper, lower, number, symbol)",
      });
    }

    user.password = newPassword;
    await user.save();

    return res
      .status(200)
      .json({ success: true, message: "Password changed successfully" });
  } catch (error) {
    console.error("Change Password Error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
