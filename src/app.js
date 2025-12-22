const express = require('express');

const app = express();

// this will handle all HTTP methods for /user
app.use('/user', (req, res) => {
  res.send('Handling all HTTP methods for /user');
});

// this will only handle GET call to /user
app.get('/user', (req, res) => {
  res.send({ firstName: 'Niraj', lastName: 'Kumar' });
});

// this will only handle POST call to /user
app.post('/user', (req, res) => {
  // saving data to DB
  res.send('data saved successfully to database');
});

// this will only handle DELETE call to /user
app.delete('/user', (req, res) => {
  // deleting data from DB
  res.send('data deleted successfully from database');
});

module.exports = app;
