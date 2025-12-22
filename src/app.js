const express = require('express');

const app = express();

app.use('/hello/2', (req, res) => {
  res.send('Hello from hello/2');
});

app.use('/hello', (req, res) => {
  res.send('Hello from hello');
});

app.use('/test', (req, res) => {
  res.send('Hello from test');
});

app.use('/', (req, res) => {
  res.send('Welcome to DevTinder');
});

module.exports = app;
