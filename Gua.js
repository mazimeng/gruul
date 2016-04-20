var yearLoop = 6;
function Gua(db) {
  this.db = db;
  this.collection = db.collection('gua');
};

// var guaUpdate = {
//   guaUpper: '',
//   guaLower: '',
//   year: 0000,
//   numberUpper: 0,
//   numberLower: 0
// };
Gua.prototype.update = function(guaUpdate) {
  var self = this;
  var years = self.generateYears(guaUpdate.year);

  var doc = {
    guaUpper: guaUpdate.guaUpper,
    guaLower: guaUpdate.guaLower,
    years: years,
    numberUpper: guaUpdate.numberUpper,
    numberLower: guaUpdate.numberLower
  };

  console.log('updating doc', doc);

  return self.collection.findAndModify({
    guaUpper: guaUpdate.guaUpper,
    guaLower: guaUpdate.guaLower
  }, [], doc, {
    upsert: true
  });
};

Gua.prototype.findByYear = function(year) {
  year = parseInt(year);
  return this.collection.find({
    years: {
      '$elemMatch': {
        '$eq': year
      }
    }
  }).toArray();
};

Gua.prototype.generateYears = function(year) {
  var years = [];
  var step = 60;
  year = parseInt(year);
  for(var i=1; i<=yearLoop; ++i) {
    years.push(year + (i * step));
    years.push(year - (i * step));
  }
  years.push(year);
  return years;
};

module.exports = Gua;
