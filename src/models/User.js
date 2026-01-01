const mongoose = require('mongoose');

// Creating User Schema/Blueprint/Structure using mongoose
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    age: {
      type: Number,
      min: 0,
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

// Creating Model
module.exports = mongoose.model('User', userSchema);
