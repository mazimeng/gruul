var TianganDizhi = require('../tiangan_dizhi');

var tianganDizhi = new TianganDizhi();

var symbol = tianganDizhi.findSymbol('丙', '午');
var name = tianganDizhi.translateSymbol(symbol);
console.log(symbol, name);
