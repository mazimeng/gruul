var express = require('express');
var sha1= require('sha1');

var app = express();

app.get('/', function (req, res) {
  var signature = req.query.signature;
  var timestamp = req.query.timestamp;
  var nonce = req.query.nonce;
  var echostr = req.query.echostr;
  var token = 'workasintended';

  if(!signature || !timestamp || !nonce || !echostr) {
    res.send('Bad Request');
    return;
  }

  var seq = [token, timestamp, nonce];
  var sig = sha1(seq.sort().join(''));

  if(sig == signature) {
    res.send(echostr);
  }
  else {
    res.send('Bad Request');
  }
});

app.listen(3000, function () {
  console.log('app is listening on port 3000');
});