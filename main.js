var MongoClient = require('mongodb').MongoClient;
var config = require('./config.js');
var Gua = require('./Gua');
var weixin = require('./Weixin');

var Weixin = weixin.Weixin;
var TextMessage = weixin.TextMessage;

MongoClient.connect(config.db.url, function(err, db) {
  if(err) console.log(err);

  var xml = "<xml><ToUserName><![CDATA[toUser]]></ToUserName><FromUserName><![CDATA[fromUser]]></FromUserName><CreateTime>1348831860</CreateTime><MsgType><![CDATA[text]]></MsgType><Content><![CDATA[1988]]></Content> <MsgId>1234567890123456</MsgId> </xml>";
  var gua = new Gua(db);
  gua.findByYear('1988').then(function(docs){
    debugger
    console.log(docs);
  });
  var weixin = new Weixin(gua);
  var text = new TextMessage(xml);
  weixin.routeGua(text).then(function(msg){
    console.log(msg);
  });

  // gua.update({
  //   guaUpper: 'aa',
  //   guaLower: 'bb',
  //   year: 1998,
  //   numberUpper: 2,
  //   numberLower: 4
  // });
  //
  // console.log(gua.generateYears(1983));
  // gua.findByYear(1987).toArray().then(function(docs) {
  //   console.log('hehe', docs);
  // });
});
