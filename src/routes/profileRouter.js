const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/authMiddleware");
const {
  getProfile,
  updateProfile,
  deleteProfile,
  changePassword,
} = require("../controllers/userController");

// ========== PROTECTED ROUTES (Auth Required) ==========
// Apply auth middleware to all routes below
router.use(authMiddleware);

// Profile APIs:
router.get("/view", getProfile);
router.patch("/edit", updateProfile);
router.delete("/delete", deleteProfile);
router.patch("/password", changePassword);
// router.get('/:userId', getUser);

module.exports = router;
