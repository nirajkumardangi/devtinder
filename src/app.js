const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();

const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");

app.use(cookieParser());
app.use(express.json());
app.use("/auth", authRoutes);
app.use("/api/users", userRoutes);

module.exports = app;
