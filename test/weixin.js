var express = require('express');
var sha1= require('sha1');
var bodyParser = require('body-parser');
var cheerio = require('cheerio');
var MongoClient = require('mongodb').MongoClient;
var config = require('../config');
var process = require('process');

var weixin = require('../Weixin');
var Gua = require('../Gua');
var TianganDizhi = require('../tiangan_dizhi');
var Weixin = weixin.Weixin;
var TextMessage = weixin.TextMessage;

var app = express();
var db = null;

MongoClient.connect(config.db.url(), function(err, database) {
  if(err) console.log(err);
  else console.log('mongodb connected');
  db = database;

  var xml = function(content) {
      return "<xml><ToUserName><![CDATA[toUser]]></ToUserName><FromUserName><![CDATA[fromUser]]></FromUserName><CreateTime>1348831860</CreateTime><MsgType><![CDATA[text]]></MsgType><Content><![CDATA["+content+"]]></Content> <MsgId>1234567890123456</MsgId> </xml>";
  };

  var gua = new Gua(db);
  var tianganDizhi = new TianganDizhi();
  var weixin = new Weixin(gua, tianganDizhi);
  var text = new TextMessage(xml(1980));
  weixin.route(text).then(function(msg){
    console.log(msg);
  });

  text = new TextMessage(xml('甲午'));
  weixin.route(text).then(function(msg){
    console.log(msg);
  });

  console.log(weixin.printTianganDizhi());
});
