var express = require('express');
var sha1= require('sha1');
var bodyParser = require('body-parser');

var app = express();
app.use(bodyParser.text({ type: 'text/xml' }));

var processWeixin = function(req, res) {
  console.log(req.body, req.headers);
  res.send('success');
};

app.get('/hi', function (req, res) {
  res.send('hi');
});

app.post('/', function (req, res) {
  processWeixin(req, res);
});
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
