const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/authMiddleware");
const {
  getProfile,
  updateProfile,
  deleteProfile,
  changePassword,
} = require("../controllers/profileController");

// ========== PROTECTED ROUTES (Auth Required) ==========
// Apply auth middleware to all routes below
router.use(authMiddleware);

// Profile APIs:
router.get("/view", getProfile); // View own profile
router.patch("/edit", updateProfile); // Edit profile
router.delete("/delete", deleteProfile); // Delete profile
router.patch("/password", changePassword); // Forget password 

module.exports = router;
