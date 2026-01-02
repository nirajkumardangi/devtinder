const User = require('../models/User');

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

// UPDATE
exports.updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true, // return updated document
      runValidators: true, // enables schema validation
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// DELETE
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// SIGN-UP
exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const user = await User.create({ name, email, password });

    res.status(201).json({
      message: 'User created',
      data: {
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
