var cheerio = require('cheerio');
var Promise = require('promise');
var TianganDizhi = require('./tiangan_dizhi');

var cdata = function(text) {
  return '<![CDATA['+text+']]>';
};

function Weixin(gua, tianganDizhi) {
  this.gua = gua;
  this.tianganDizhi = tianganDizhi;
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

Weixin.prototype.makeReply = function(textMessage) {
  var responseMessage = new TextMessage();
  responseMessage.toUserName = textMessage.fromUserName;
  responseMessage.fromUserName = textMessage.toUserName;
  responseMessage.createTime = 12345678;

  return responseMessage;
};

Weixin.prototype.reply = function(textMessage, what) {
  var responseMessage = this.makeReply(textMessage);
  responseMessage.content = what;

  return responseMessage;
};

Weixin.prototype.replyXml = function(textMessage, what) {
  var responseMessage = this.makeReply(textMessage);
  responseMessage.content = what;

  return responseMessage.toXml();
};

Weixin.prototype.route = function(textMessage) {
  var self = this;
  var tokens = textMessage.content.trim().split(' ');

  var year = tokens[0];
  var reply = 'success';

  if(tokens.length!=1 && tokens.length != 5) return new Promise(function (resolve, reject) {
    resolve(self.replyXml(textMessage, 'invalid arguments'));
  });

  if(isNaN(year)) {
    var tianganDizhi = year;
    if(tianganDizhi.length != 2) {
      return new Promise(function (resolve, reject) {
        resolve(self.replyXml(textMessage, 'invalid arguments'));
      });
    }

    var first = tianganDizhi[0];
    var second = tianganDizhi[1];
    var symbol = self.tianganDizhi.findSymbol(first, second);

    if(!symbol) {
      return new Promise(function (resolve, reject) {
        resolve(self.replyXml(textMessage, 'invalid arguments'));
      });
    }

    var name = this.tianganDizhi.translateSymbol(symbol);

    return new Promise(function (resolve, reject) {
      resolve(self.replyXml(textMessage, name));
    });
  }
  //if its 4-digit years
  else if(tokens.length == 1) {
    //query
    return new Promise(function (resolve, reject) {
      self.gua.findByYear(year).then(function(docs){
        var content = '';
        if(docs.length == 0) {
          content = 'no record';
        }
        else {
          content = docs.map(function(v){
            return v.guaUpper + v.numberUpper + '\n' + v.guaLower + v.numberLower + '\n';
          }).join('');
        }
        resolve(self.replyXml(textMessage, content));
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
        resolve(self.replyXml(textMessage, 'update success'));
      });
    });
  }
}

module.exports = {
  Weixin: Weixin,
  TextMessage: TextMessage
};
