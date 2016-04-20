var cheerio = require('cheerio');
var Promise = require('promise');

var cdata = function(text) {
  return '<![CDATA['+text+']]>';
};

function Weixin(gua) {
  this.gua = gua;
};

function TextMessage(xml) {
  if(!xml) return;

  var $ = cheerio.load(xml, {
    xmlMode: true
  });

  this.toUserName = $('xml ToUserName').text();
  this.fromUserName = $('xml FromUserName').text();
  this.createTime = $('xml CreateTime').text();
  this.content = $('xml Content').text();
  // this.msgId = $('xml MsgId').text();
};

TextMessage.prototype.toXml = function() {
  var $ = cheerio.load('<xml>', {
    xmlMode: true
  });
  $('xml').append('<ToUserName>');
  $('xml').append('<FromUserName>');
  $('xml').append('<CreateTime>');
  $('xml').append('<MsgType>');
  $('xml').append('<Content>');
  $('xml ToUserName').append(cdata(this.toUserName));
  $('xml FromUserName').append(cdata(this.fromUserName));
  $('xml CreateTime').text(this.createTime);
  $('xml MsgType').append(cdata('text'));
  $('xml Content').append(cdata(this.content));
  return $.xml();
};

Weixin.prototype.route = function(input) {
  var textMessage = new TextMessage(input);

  return this.routeGua(textMessage);
};

Weixin.prototype.routeGua = function(textMessage) {
  var self = this;
  var tokens = textMessage.content.trim().split(' ');

  var year = tokens[0];
  if(isNaN(year)) return new Promise(function (resolve, reject) {
    resolve('success');
  });

  //if its 4-digit years
  if(tokens.length == 1) {
    //query
    return new Promise(function (resolve, reject) {
      self.gua.findByYear(year).then(function(docs){
        var responseMessage = new TextMessage();
        responseMessage.toUserName = textMessage.fromUserName;
        responseMessage.fromUserName = textMessage.toUserName;
        responseMessage.createTime = 12345678;
        responseMessage.content = docs.map(function(v){
          return v.guaUpper + v.numberUpper + '\n' + v.guaLower + v.numberLower;
        }).join(',');

        resolve(responseMessage.toXml());
      });
    });
  }
  else {
    var guaUpper = tokens[1];
    var guaLower = tokens[2];
    var numberUpper = tokens[3];
    var numberLower = tokens[4];
    var update = {
      guaUpper: guaUpper,
      guaLower: guaLower,
      year: year,
      numberUpper: numberUpper,
      numberLower: numberLower
    };

    //update
    return new Promise(function (resolve, reject) {
      self.gua.update(update).then(function(){
        var responseMessage = new TextMessage();
        responseMessage.toUserName = textMessage.fromUserName;
        responseMessage.fromUserName = textMessage.toUserName;
        responseMessage.createTime = 12345678;
        responseMessage.content = 'update success';

        resolve(responseMessage.toXml());
      });
    });
  }
}

module.exports = {
  Weixin: Weixin,
  TextMessage: TextMessage
};