const express = require('express');

const app = express();

app.get('/', (req, res) => {
  res.send('Welcome to DevTinder');
});

app.use('/hello', (req, res) => {
  res.send('Hello hello hello');
});

module.exports = app;
