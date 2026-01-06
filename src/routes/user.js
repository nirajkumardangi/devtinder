const express = require("express");
const router = express.Router();

const { userAuth } = require("../middlewares/auth");
const {
  getUser,
  updateUser,
  deleteUser,
  getUsers,
} = require("../controllers/user");


// USERS
// router.get("/", userAuth, getUsers);
router.get("/profile", userAuth, getUser);
router.patch("/profile/edit", userAuth, updateUser);
router.delete("/profile/delete", userAuth, deleteUser);

module.exports = router;
