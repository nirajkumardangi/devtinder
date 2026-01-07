const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/authMiddleware");
const {
  sendRequest,
  reviewRequest,
} = require("../controllers/requestController");

// ========== PROTECTED ROUTES (Auth Required) ==========
router.use(authMiddleware);

// Connection Request APIs
router.post("/send/:status/:toUserId", sendRequest);
router.post("/review/:status/:requestId", reviewRequest);

module.exports = router;
