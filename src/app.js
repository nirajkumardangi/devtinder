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

module.exports = app;
