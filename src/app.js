const express = require('express');

const app = express();

app.get('/user', (req, res) => {
  console.log(req.method);        // GET, POST, etc.
  console.log(req.url);           // /user
  console.log(req.params);        // Route parameters
  console.log(req.query);         // Query string parameters
  console.log(req.body);          // Request body (needs middleware)
  console.log(req.headers);       // HTTP headers
  console.log(req.cookies);       // Cookies (needs cookie-parser)
  console.log(req.ip);            // Client IP address
  res.send('user get 1');
});

module.exports = app;
