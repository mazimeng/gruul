var express = require('express');
var sha1= require('sha1');
var bodyParser = require('body-parser');
var cheerio = require('cheerio');
var MongoClient = require('mongodb').MongoClient;

var weixin = require('./Weixin');
var Gua = require('./Gua');
var Weixin = weixin.Weixin;
var TextMessage = weixin.TextMessage;

var app = express();
var db = null;
MongoClient.connect(config.db.url, function(err, database) {
  if(err) console.log(err);
  db = database;

  app.listen(3000);
  console.log('Listening on port 3000');
});

app.use(bodyParser.text({ type: 'text/xml' }));

app.get('/hi', function (req, res) {
  res.send('hi');
});

app.post('/', function (req, res) {
  var gua = new Gua(db);
  var weixin = new Weixin(gua);
  var text = new TextMessage(req.body);
  weixin.routeGua(text).then(function(msg){
    res.send(msg);
  });
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
