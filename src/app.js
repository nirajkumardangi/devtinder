const express = require('express');

const app = express();

// Matches: /ab, /abc
app.get(/^\/ab?c$/, (req, res) => {
  res.send('Pattern: ab?c');
});

// Matches: /abc, /abbc, /abbbc, /abbbbbbc
app.get(/^\/ab+c$/, (req, res) => {
  res.send("Pattern: ab+c");
});

// Matches: /abcd, /abxcd, /ab123cd, /abRANDOMcd
app.get(/^\/ab.*cd$/, (req, res) => {
  res.send("Pattern: ab*cd");
});

// Express string patterns treat * as a wildcard
app.get('/ab*cd', (req, res) => {
  res.send("Pattern: ab*cd");
});

// Matches: /abc, /abc, /abcbcbc (one or more 'bc')
app.get(/^\/a(bc)+$/, (req, res) => {
  res.send("Pattern: a(bc)+");
});

// Matches any route containing 'fly'
app.get(/.*fly$/, (req, res) => {
  res.send("Route contains 'fly'");
});

// Access Query Parameter
app.get('/user', (req, res) => {
  console.log(req.query);
  res.send(`User ID: ${req.query.userId}, Name: ${req.query.name1}`);
});

// Route Parameter
app.get('/user/:userId', (req, res) => {
  console.log(req.params);
  res.send(`userId: ${req.params.userId}`);
});

// Multiple Parameter
app.get('/user/:userId/post/:postId', (req, res) => {
  console.log(req.params);
  res.send(`User: ${req.params.userId}, Post: ${req.params.postId}`);
});

// URL: /search?term=nodejs&page=2
app.get('/search', (req, res) => {
  const { term, page } = req.query;
  res.send(`Searching for: ${term}, Page: ${page}`);
});

module.exports = app;
