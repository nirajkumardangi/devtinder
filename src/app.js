const express = require('express');

const app = express();

// Middleware
app.use(
  '/user',
  [
    (req, res, next) => {
      console.log('handle route 1');
      // res.send('1st response!');
      next();
    },
    (req, res, next) => {
      console.log('handle route 2');
      // res.send('2nd response!');
      next();
    },
  ],
  (req, res) => {
    console.log('handle route 3');
    res.send('3rd response!');
    next();
  }
);

module.exports = app;
