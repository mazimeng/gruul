var coords = [
  [1, 1, 2, 2],
  [2, 2, 3, 3]
];

var years = [];
var hours = [];

function Guayear() {
  
};

Houryear.prototype.findSymbol = function(first, second){
  var yearIndex = years.indexOf(first);
  yearIndex = yearIndex >= 0 ? yearIndex : years.indexOf(second);

  var hourIndex = hours.indexOf(first);
  hourIndex = hourIndex >= 0 ? hourIndex : hours.indexOf(second);

  var symbol = coords[hourIndex][yearIndex];
  return symbol;
};

Houryear.prototype.translate = function(symbol){
  var name = null;
  switch(symbol) {
    case 0:
    case 1
  }

  return name; 
};
