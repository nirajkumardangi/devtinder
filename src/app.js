const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();

const authRouter = require("./routes/authRouter");
const profileRouter = require("./routes/profileRouter");
const requestRouter = require("./routes/requestRouter");
const userRouter = require("./routes/userRouter");

app.use(cookieParser());
app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/profile", profileRouter);
app.use("/api/request", requestRouter);
app.use("/api/users", userRouter);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

// Missing 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Page not found" });
});


module.exports = app;
