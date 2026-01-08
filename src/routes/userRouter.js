const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/authMiddleware");
const {
  getConnectionRequests,
  getConnections,
  getFeed
} = require("../controllers/userController");

// User APIs:
router.get("/requests/received", authMiddleware, getConnectionRequests); // Get pending requests
router.get("/connections", authMiddleware, getConnections); // Get all connections
router.get("/feed", authMiddleware, getFeed); //  Get user feed (paginated)

module.exports = router;
