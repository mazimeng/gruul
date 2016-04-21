var symbols = [
///0  1  2  3  4  5  6  7  8  9  10 11
// 子 丑  寅 卯 辰 巳 午 未  申 酉 戌 亥
  [1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1],//0 甲
  [1, 0, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1],//1 乙
  [0, 0, 1, 1, 0, 1, 1, 3, 0, 1, 2, 0],//2 丙
  [0, 0, 1, 1, 0, 1, 1, 3, 0, 1, 4, 0],//3 丁
  [0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 2, 0],//4 戊
  [0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 1, 0],//5 己
  [0, 2, 0, 0, 1, 0, 0, 0, 1, 1, 0, 0],//6 庚
  [0, 1, 0, 0, 1, 0, 0, 0, 1, 1, 0, 0],//7 辛
  [1, 3, 0, 0, 2, 0, 0, 0, 1, 1, 0, 1],//8 壬
  [1, 3, 0, 0, 4, 0, 0, 0, 1, 1, 0, 1],//9 癸
];

var TIAN_GAN = '甲乙丙丁戊己庚辛壬癸';
var DI_ZHI = '子丑寅卯辰巳午未申酉戌亥';

function TianganDizhi() {

};

TianganDizhi.prototype.translateSymbol = function(symbol){
  var name = null;
  switch(symbol) {
    case 0:
      name = '空';
      break;
    case 1:
      name = '勾';
      break;
    case 2:
      name = '圈';
      break;
    case 3:
      name = '弱9';
      break;
    case 4:
      name = '弱3';
      break;
  }

  return name;
};

TianganDizhi.prototype.findSymbol = function(first, second){
  var tianganIndex = TIAN_GAN.indexOf(first);
  tianganIndex = tianganIndex >= 0 ? tianganIndex : TIAN_GAN.indexOf(second);

  var dizhiIndex = DI_ZHI.indexOf(first);
  dizhiIndex = dizhiIndex >= 0 ? dizhiIndex : DI_ZHI.indexOf(second);

  if(tianganIndex < 0 || dizhiIndex < 0) {
    return null;
  }

  var symbol = symbols[tianganIndex][dizhiIndex];
  return symbol;
};


module.exports = TianganDizhi;
