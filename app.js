var express = require('express');
var sha1= require('sha1');
var bodyParser = require('body-parser');
var cheerio = require('cheerio');

var app = express();
app.use(bodyParser.text({ type: 'text/xml' }));

var cdata = function(text) {
  //return text;
  return '<![CDATA['+text+']]>';
};

var processWeixin = function(req, res) {
  var $ = cheerio.load(req.body, {
    xmlMode: true
  });
  var msg = {
    ToUserName: $('xml FromUserName').text(),
    FromUserName: $('xml ToUserName').text(),
    CreateTime: 12345678,
    Content: 'hello\nworld'
  };

  $ = cheerio.load('<xml>', {
    xmlMode: true
  });
  $('xml').append('ToUserName');
  $('xml').append('FromUserName');
  $('xml').append('CreateTime');
  $('xml').append('Content');
  $('xml ToUserName').text(cdata(msg.ToUserName));
  $('xml FromUserName').text(cdata(msg.FromUserName));
  $('xml CreateTime').text(msg.CreateTime);
  $('xml Content').text(cdata(msg.Content));

  console.log($.xml());
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
