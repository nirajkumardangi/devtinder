const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/authMiddleware");
const {
  getProfile,
  updateProfile,
  changePassword,
  // deleteProfile,
} = require("../controllers/profileController");

// Protected routes
router.use(authMiddleware);

// Profile APIs
router.get("/", getProfile); // View own profile
router.patch("/", updateProfile); // Update profile
router.patch("/password", changePassword); // Change password
// router.delete("/", deleteProfile); // Delete profile

module.exports = router;
