const express = require('express');
const router = express.Router();

const {
  createUser,
  getUser,
  updateUser,
  deleteUser,
  signup,
} = require('../controllers/user.controller');

// AUTH ROUTES
router.post('/signup', signup);

// CRUD ROUTES
router.post('/', createUser);
router.get('/:id', getUser);
router.patch('/:id', updateUser);
router.delete('/:id', deleteUser);


module.exports = router;
