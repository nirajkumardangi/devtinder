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

    if (!req.body.name) {
      return res.status(400).json({ message: "Name is required" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name: req.body.name.trim() },
      { new: true, runValidators: true }
    );

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
    if (error.name === "ValidationError") {
      const message = Object.values(error.errors)[0].message;
      return res.status(400).json({ message });
    }

    res.status(500).json({ message: "Server error" });
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

    const isMatch = await user.comparePassword(currentPassword);
    console.log(isMatch);

    if (!isMatch) {
      return res.status(401).json({
        message: "Current password is incorrect",
      });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({
      message: "Password changed successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
    });
  }
};
