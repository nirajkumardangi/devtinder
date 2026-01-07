const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/authMiddleware");
const { getConnectionRequests } = require("../controllers/userController");

// User APIs:
router.use("/requests/received", authMiddleware, getConnectionRequests);


module.exports = router;
