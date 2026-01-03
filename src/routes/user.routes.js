const express = require("express");
const router = express.Router();

const {
  signup,
  getUser,
  updateUser,
  deleteUser,
  getUsers,
} = require("../controllers/user.controller");

// AUTH
router.post("/signup", signup);

// USERS
router.get("/", getUsers);
router.get("/:id", getUser);
router.patch("/:id", updateUser);
router.delete("/:id", deleteUser);

module.exports = router;
