const express = require("express");
const router = express.Router();

// Connection Request APIs: 
router.post("/send");
router.post("/accept");
router.post("/reject");
router.get("/recived");
