var readline = require('readline');
var fs = require('fs');
var MongoClient = require('mongodb').MongoClient;
var config = require('./config');
var Gua = require('./Gua');

var db = null;


var imp = function(gua) {
  var lineReader = readline.createInterface({
    input: fs.createReadStream('init.txt', {encoding: 'utf8'})
  });
  lineReader.on('line', function(line) {
    console.log('importing', line);
    var tokens = line.split(' ');
    var year = tokens[0];
    var mark = tokens[1];
    
    gua.update({
      guaUpper: mark[0],
      guaLower: mark[1],
      numberUpper: mark[2],
      numberLower: mark[3],
      year: year
    }).then(function(){
      if(tokens.length == 3) {
        var mark2 = tokens[2];
        return gua.update({
          guaUpper: mark2[0],
          guaLower: mark2[1],
          numberUpper: mark2[2],
          numberLower: mark2[3],
          year: year
        });
      }
    });
  });
};
MongoClient.connect(config.db.url, function(err, database) {
  if(err) console.log(err);
  db = database;
  var gua = new Gua(db);
  var coll = db.collection('gua_data');
  var guaCollection = db.collection('gua');
  
//  guaCollection.deleteMany({}).then(function(){
    imp(gua);
  //});
  return;
  coll.find({}).toArray().then(function(docs){
    var dup = [];
    for(var i=0; i<docs.length; ++i) {
      var doc = docs[i];
      if(dup.indexOf(doc.gua)>=0) {
        console.log('bad', doc.gua);
      }
      else {
        dup.push(doc.gua);
      }
    } 
  });
  return;
});

