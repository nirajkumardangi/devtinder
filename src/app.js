const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();

// Routers
const authRouter = require("./routes/authRouter");
const profileRouter = require("./routes/profileRouter");
const requestRouter = require("./routes/requestRouter");
const userRouter = require("./routes/userRouter");

// 1. Global Middlewares
app.use(cookieParser());
app.use(express.json());

// 2. API Routes
app.use("/auth", authRouter);
app.use("/profile", profileRouter);
app.use("/request", requestRouter);
app.use("/users", userRouter);

// 3. 404 Handler (must come BEFORE error handler)
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Route not found - ${req.method} ${req.originalUrl}`,
  });
});

// 5. Centralized Error Handler (must be LAST)
app.use((err, req, res, next) => {
  console.error(`[ERROR] ${err.message}`);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

module.exports = app;
