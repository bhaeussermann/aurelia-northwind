'use strict';

const express = require('express');
const path = require('path');
const app = express();
const request = require('request');

app.use('/', express.static(path.join(__dirname, 'dist')));
app.get('/', (_req, res) => res.sendFile(path.join(__dirname, 'dist/index.html')));

app.all('/api/*', function(req, res) {
  request('https://northwind-express-api.herokuapp.com' + req.url.substring(4), 
    { 
      method: req.method, 
      body: (req.method === 'POST' || req.method === 'PUT') ? JSON.stringify(req.body) : null
    }, 
    function(error, response, body) {
      if (error)
        res.status(500).send({ message: 'Error calling Northwind service: ' + (error.code ? error.code : error) });
      else
        res.status(response.statusCode).send(body);
    });
});

app.listen(9000);
