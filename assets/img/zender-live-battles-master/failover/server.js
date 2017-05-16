var express = require("express");
var request = require('request');
var app = express();

app.get('*', (req, res) => {
  res.redirect('http://livebattles.s3-website.eu-central-1.amazonaws.com/');
});

/*
app.get('*', function(req,res) {
  //modify the url in any way you want
  var newurl = 'http://zender-live-battles.s3-website.eu-central-1.amazonaws.com/';
  request(newurl).pipe(res);
});*/

app.listen(8000);