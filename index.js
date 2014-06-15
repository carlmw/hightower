var CONFIG = require('./config.json'),
    serialPort = require('serialport'),
    SerialPort = serialPort.SerialPort,
    port = new SerialPort(CONFIG.serialPort, {
      parser: serialPort.parsers.readline('\n'),
      baudrate: 9600
    }),
    querystring = require('querystring'),
    https = require('https');

port.on('data', function (distance) {
  var postData = {};
  postData[CONFIG.fieldName] = distance;
  postData = querystring.stringify(postData);

  var reqOptions = {
      accept: '*/*',
      host: 'docs.google.com',
      port: 443,
      path: '/forms/d/' + CONFIG.spreadSheetKey + '/formResponse',
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': postData.length
      }
    },
    req = https.request(reqOptions, function (res) {
      console.log('Logged: ' + distance);
    });

  req.write(postData);
  req.end();
});
