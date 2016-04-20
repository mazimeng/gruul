var express = require('express');
var sha1= require('sha1');
var bodyParser = require('body-parser');
var xml2js = require('xml2js');

var app = express();
app.use(bodyParser.text({ type: 'text/xml' }));

var cdata = function(text) {
  //return text;
  return '<![CDATA['+text+']]>';
};
var processWeixin = function(req, res) {
  xml2js.parseString(req.body, function(err, result){
    console.dir(result);
    var msg = {
      xml: {
        ToUserName: result.xml.FromUserName,
        FromUserName: '"'+result.xml.ToUserName[0] +'"',
        CreateTime: 12345678,
        Content: cdata('hello\nworld')
      }
    };
    var builder = new xml2js.Builder({
      cdata: true
    });
    var xml = builder.buildObject(msg);
    console.log(xml);
    res.send('success');
  });
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
