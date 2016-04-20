var express = require('express');
var sha1= require('sha1');
var bodyParser = require('body-parser');
var cheerio = require('cheerio');

var app = express();
app.use(bodyParser.text({ type: 'text/xml' }));

var cdata = function(text) {
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
  console.log('hehe', $('xml Content').text().indexOf('\n'));

  $ = cheerio.load('<xml>', {
    xmlMode: true
  });
  $('xml').append('<ToUserName>');
  $('xml').append('<FromUserName>');
  $('xml').append('<CreateTime>');
  $('xml').append('<MsgType>');
  $('xml').append('<Content>');
  $('xml ToUserName').append(cdata(msg.ToUserName));
  $('xml FromUserName').append(cdata(msg.FromUserName));
  $('xml CreateTime').append(msg.CreateTime);
  $('xml MsgType').append(cdata('text'));
  $('xml Content').append(cdata(msg.Content));

  console.log(req.body, msg, $.xml());
  res.send($.xml());
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
