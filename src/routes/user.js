const express = require("express");
const router = express.Router();

const {
  getUser,
  updateUser,
  deleteUser,
  getUsers,
} = require("../controllers/user");

// USERS
router.get("/", getUsers);
router.get("/profile", getUser);
router.patch("/profile/edit", updateUser);
router.delete("/profile/delete", deleteUser);

module.exports = router;
