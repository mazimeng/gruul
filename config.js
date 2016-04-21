var process = require('process');

var config = {
  db: {
    url: function() {
      var mongodbIp = process.env.GRUUL_MONGODB_PORT_27017_TCP_ADDR;
      var mongodbPort = process.env.GRUUL_MONGODB_PORT_27017_TCP_PORT;

      if(mongodbIp && mongodbPort) {
        return 'mongodb://'+mongodbIp+':'+mongodbPort+'/gruul';
      }
      else {
        return 'mongodb://192.168.0.4:27017/gruul';
      }
    }
  }
};

module.exports = config;
