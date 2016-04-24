function Logger(db) {
  this.db = db;
  this.collection = db.collection('request_log');
};

Logger.prototype.log = function(what) {
  var self = this;

  return self.collection.insert({
    what: what    
  });
};

module.exports = Logger;
