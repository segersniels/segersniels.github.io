require('dotenv').config()
var express = require("express");
var app = express();
const path = require('path');

app.use(express.static('build'));

app.get('*', (req, res) => {
  res.sendFile(path.resolve('build', 'index.html'));
});

app.listen(8080);