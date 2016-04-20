var cheerio = require('cheerio');
var xml = "<xml><ToUserName><![CDATA[toUser]]></ToUserName><FromUserName><![CDATA[fromUser]]></FromUserName><CreateTime>1348831860</CreateTime><MsgType><![CDATA[text]]></MsgType><Content><![CDATA[this is a test]]></Content> <MsgId>1234567890123456</MsgId> </xml>";
var $ = cheerio.load('<xml>', {
  xmlMode: true
});
$('xml')
  .append('<ToUserName>')

  .append('<![CDATA[toUser]]>');
console.log($.xml());
