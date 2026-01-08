const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/authMiddleware");
const {
  getConnectionRequests,
  getConnections,
  getFeed
} = require("../controllers/userController");

// All protected
router.use(authMiddleware);

// Pending requests (like your "inbox")
router.get("/requests", getConnectionRequests);

// Accepted matches
router.get("/connections", getConnections);

// Feed to swipe
router.get("/feed", getFeed);

module.exports = router;
