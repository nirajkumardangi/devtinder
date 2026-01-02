const mongoose = require('mongoose');
const validator = require("validator");

// Creating User Schema/Blueprint/Structure using mongoose
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minLength: [3, "Name must be at least 3 characters"],
      maxLength: [50, "Name must be at least most 50 characters"],
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: validator.isEmail,
        message: "Envaid email address",
      },
      // match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      trim: true,
      minLength: [8, "Password must be at least 8 characters"],
      select: false,
    },
    // age: {
    //   type: Number,
    //   min: [18, "Age must be at least 18"],
    //   max: [100, "Age must be below 100"],
    //   default: 18,
    // },
    // gender: {
    //   type: String,
    //   required: true,
    //   lowecase: true,
    //   validate: {
    //     validator: function (value) {
    //       return ["male", "female", "other"].includes(value);
    //     },
    //     message: "Gender must be male, female or other",
    //   },
    // },
    // role: {
    //   type: String,
    //   enum: ["user", "admin"],
    //   default: "user",
    // },
    // isActive: {
    //   type: Boolean,
    //   default: true,
    // },
    // createdAt: {
    //   type: Date,
    //   default: Date.now(),
    //   immutable: true,
    // },
  },
  { timestamps: true }
);

// Creating Model
module.exports = mongoose.model('User', userSchema);
