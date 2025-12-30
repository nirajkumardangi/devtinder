const express = require('express');
const User = require('./models/User');

const app = express();

app.use(express.json());

// Common Mongoose Operations

// 1. CREATE: a new user in db
const createUser = async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// 2. READ: find/get users
const getUser = async (req, res) => {
  try {
    // Find all
    // const user = await User.find({});

    // Find one
    // const user = await User.findOne({ email: 'rashmi@gmail.com' });

    // Find by id
    const user = await User.findById('695149fe6107ecc8f813b1f1');

    console.log(user);
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// 3. UPDATE: update a user
const updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      // req.params.id,
      '6950f87e889e6051b2d0f44',
      { email: 'nirajdangi@fmail.com' }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// DELETE: delete a user
const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete('6950f87e889e6051b2d0f44c');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    console.log(user);
    res.status(400).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Routes:::
// CREATE
app.post('/createUser', createUser);

// READ/FIND
app.get('/getUser', getUser);

// UPDATE
app.patch('/updateUser', updateUser);

// DELETE
app.delete('/deleteUser', deleteUser);

module.exports = app;
