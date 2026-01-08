const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/authMiddleware");
const {
  sendRequest,
  reviewRequest,
} = require("../controllers/requestController");

// All routes protected
router.use(authMiddleware);

// Connection Request APIs
router.post("/send/:status/:toUserId", sendRequest); // Send connections (intrested + ognored)
router.post("/review/:status/:requestId", reviewRequest); // Review connections (accept + reject)

module.exports = router;
