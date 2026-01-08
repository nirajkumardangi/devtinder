const express = require("express");
const router = express.Router();

const { signup, login, logout } = require("../controllers/authController");

// Authentication APIs:
router.post("/signup", signup); // Register new user
router.post("/login", login); // Login user
router.post("/logout", logout); // Logout user

module.exports = router;
