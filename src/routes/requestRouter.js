const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/authMiddleware");
const { sendRequest } = require("../controllers/connectionRequestController");

// ========== PROTECTED ROUTES (Auth Required) ==========
router.use(authMiddleware);

// Connection Request APIs
router.post("/send/:status/:toUserId", sendRequest);
// router.post("/accept");
// router.post("/reject");
// router.get("/received");

module.exports = router;
