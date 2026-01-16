require("dotenv").config();
const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minLength: [2, "Name must be at least 2 characters"],
      maxLength: [40, "Name must be at most 40 characters"],
      match: [/^[A-Za-z ]+$/, "Name must contain only letters and spaces"],
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: validator.isEmail,
        message: "Invalid email format",
      },
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minLength: [8, "Password must be at least 8 characters"],
      select: false,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("Password must be strong");
        }
      },
    },

    // ==== Dev Profile ====
    gender: {
      type: String,
      trim: true,
      lowercase: true,
      enum: ["male", "female", "other"],
      default: "other",
    },

    age: {
      type: Number,
      min: [16, "Age must be at least 16"],
      max: [100, "Age must be realistic"],
    },

    headline: {
      type: String,
      maxLength: [80, "Headline must be under 80 characters"],
    },

    about: {
      type: String,
      maxLength: [600, "About must be under 600 characters"],
    },

    skills: {
      type: [String],
      default: [],
      lowercase: true,
      trim: true,
      validate: {
        validator: (v) => v.length <= 10,
        message: "Maximum 10 skills allowed",
      },
    },

    avatar: {
      type: String,
      default: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
    },

    location: {
      city: { type: String, trim: true },
      country: { type: String, trim: true },
    },

    // ==== New Social Links ====
    social: {
      github: { type: String, trim: true, lowercase: true },
      linkedin: { type: String, trim: true },
      website: { type: String, trim: true },
    },
  },
  { timestamps: true }
);

// JWT
userSchema.methods.getJWT = function () {
  return jwt.sign({ _id: this._id, email: this.email }, process.env.JWT_TOKEN, {
    expiresIn: "7d",
  });
};

// Hash password
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password
userSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
