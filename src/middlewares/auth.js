require("dotenv").config();
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      return res.status(401).json({
        message: "Please login",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_TOKEN);

    req.user = {
      _id: decoded._id,
    };

    next();
  } catch (error) {
    res.status(401).json({
      message: "Authentication failed",
    });
  }
};

module.exports = {
  userAuth,
};
