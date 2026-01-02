const express = require('express');
const router = express.Router();

const {
  createUser,
  getUser,
  updateUser,
  deleteUser,
  signup,
  getUserByEmail,
} = require('../controllers/user.controller');

// AUTH ROUTES
router.post('/signup', signup);

// SEARCH ROUTES
router.get('/email', getUserByEmail);

// CRUD ROUTES
router.post('/', createUser);
router.get('/:id', getUser);
router.patch('/:id', updateUser);
router.delete('/:id', deleteUser);

module.exports = router;
