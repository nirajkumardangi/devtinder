const express = require("express");
const router = express.Router();

const {
  getUser,
  updateUser,
  deleteUser,
  getUsers,
  searchUser,
} = require("../controllers/user");

// USERS
router.get("/", getUsers);
router.get("/:id", getUser);
router.patch("/:id", updateUser);
router.delete("/:id", deleteUser);

module.exports = router;
