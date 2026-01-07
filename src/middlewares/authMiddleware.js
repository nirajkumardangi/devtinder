require("dotenv").config();
const jwt = require("jsonwebtoken");
const User = require("../models/UserSchema");

module.exports = async (req, res, next) => {
  try {
    // 1. Read token from cookies
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({
        message: "Authentication required. Please login.",
      });
    }

    // 2.Verify JWT
    const decoded = jwt.verify(token, process.env.JWT_TOKEN);

    if (!decoded || !decoded._id) {
      return res.status(401).json({
        message: "Invalid token",
      });
    }

    // 3. Fetch user from database
    const user = await User.findById(decoded._id).select("+password");

    if (!user) {
      return res.status(401).json({
        message: "User not found or account deleted",
      });
    }

    // 4. Attach user to request
    req.user = user;

    // 5. Continue to next middleware / route
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Authentication failed",
    });
  }
};

// module.exports = {
//   authMiddleware,
// };
