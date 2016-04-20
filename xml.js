var parseString = require('xml2js').parseString;
var xml = "<xml><ToUserName><![CDATA[toUser]]></ToUserName><FromUserName><![CDATA[fromUser]]></FromUserName><CreateTime>1348831860</CreateTime><MsgType><![CDATA[text]]></MsgType><Content><![CDATA[this is a test]]></Content> <MsgId>1234567890123456</MsgId> </xml>";
parseString(xml, function (err, result) {
  console.dir(result.xml.ToUserName[0]);
});
