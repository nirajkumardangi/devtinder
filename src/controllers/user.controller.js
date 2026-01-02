const User = require('../models/User');
const validator = require("validator");

// CREATE
exports.createUser = async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// READ
exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// PATCH API (Update Profile)
exports.updateUser = async (req, res) => {
  try {
    const ALLOWED_UPDATES = ["name"];
    const updates = Object.keys(req.body);

    // FIELD WHITELIST CHECK
    const isValidOperation = updates.every((field) =>
      ALLOWED_UPDATES.includes(field)
    );

    if (!isValidOperation) {
      throw new Error("Invalid update fields");
    }

    // FIELD LEVEL VALIDATION
    if (req.body.name) {
      if (
        !validator.isLength(req.body.name, {
          min: 2,
          max: 20,
        })
      ) {
        throw new Error("First name must be 2-20 characters");
      }
      req.body.name = validator.escape(req.body.name.trim());
    }

    // UPDATE USER
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true, // return updated document
      runValidators: true, // enables schema validation
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: "Profile updated successfully",
      data: user,
    });

  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// DELETE
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// SIGN-UP
exports.signup = async (req, res) => {
  try {
    // DATA SANITIZATION (PICK FIELDS)
    const { name, email, password } = req.body;

    // API LEVEL VALIDATION
    if ((!name, !email, !password)) {
      throw new Error("All required fields must be provided");
    }

    if (!validator.isEmail(email)) {
      throw new Error("Invalid email format");
    }

    if (
      !validator.isStrongPassword(password, {
        minLength: 6,
        minLowercase: 1,
        minUppercase: 1,
        minSymbols: 1,
        minNumbers: 1,
      })
    ) {
      throw new Error(
        "Password must be strong (6 chars, upper, lower, number)"
      );
    }

    // BUSINESS LOGIC
    const user = await User.create({
      name: validator.escape(name.trim()),
      email: email.toLowerCase(),
      password,
    });

    res.status(201).json({
      message: "User signed up successfully",
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get User by Email or Feed (all users)
exports.getUsers = async (req, res) => {
  try {
    const email = req.query.email;

    // Case-I: Search by email --- http://localhost:3000/api/users?email=niraj@example.com
    if (email) {
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      res.json({
        message: "User found",
        user,
      });
    }

    // Case-II: Feed (all users) --- http://localhost:3000/api/users/
    const users = await User.find({});

    if (!users) {
      return res.status(404).json({
        message: "Yoy don't have any user",
      });
    }

    res.json({
      message: "Users fetched successfully",
      users,
    });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
};
