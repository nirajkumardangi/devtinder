const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/authMiddleware");
const {
  getConnectionRequests,
  getConnections,
} = require("../controllers/userController");

// User APIs:
router.get("/requests/received", authMiddleware, getConnectionRequests);
router.get("/connections", authMiddleware, getConnections);

module.exports = router;
