const express = require('express');

const app = express();
const { adminAuth, userAuth } = require('./middlewares/auth');

// Middleware

// Handle Auth Middleware for all GET, POST,...Request
app.use('/admin', adminAuth);

app.get('/user', userAuth, (req, res) => {
  res.send('Fetching user data');
});

// Get all user data
app.get('/admin/getAllData', (req, res) => {
  res.send('All User Data Sends!');
});

app.delete('/admin/deleteAllData', (req, res) => {
  res.send('All Users Data Deleted');
});



// Error Handling
app.get('/users', (req, res) => {
  throw new Error('error nnn21');
});

// Error Handling using try catch
app.get('/users', (req, res) => {
  try {
    throw new Error('error in try catch block');
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Wild Card Error Handling
app.use('/', (err, req, res, next) => {
  if (err) {
    res.status(500).send('something went wrong!');
  }
});

module.exports = app;
