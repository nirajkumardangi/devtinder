const express = require("express");
const router = express.Router();

const { userAuth } = require("../middlewares/auth");
const {
  getProfile,
  updateProfile,
  deleteProfile,
} = require("../controllers/user");

// Profile APIs:
router.get("/me", userAuth, getProfile);
router.patch("/me", userAuth, updateProfile);
router.delete("/me", userAuth, deleteProfile);
// router.get('/:userId', getUser);

module.exports = router;
