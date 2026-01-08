require("dotenv").config();
const jwt = require("jsonwebtoken");
const User = require("../models/User");

module.exports = async (req, res, next) => {
  try {
    // 1. Read token from cookies
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated",
      });
    }

    // 2. Verify JWT
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_TOKEN);
    } catch (err) {
      return res.status(401).json({
        success: false,
        message: "Session expired or invalid token",
      });
    }

    // 3. Fetch user from database
    const user = await User.findById(decoded._id).select(
      "name email gender avatar headline age skills"
    );

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found or account removed",
      });
    }

    // 5. Attach user to request context
    req.user = user;

    // 6. Continue execution
    return next();
  } catch (err) {
    console.error("Auth Middleware Error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal authentication error",
    });
  }
};
