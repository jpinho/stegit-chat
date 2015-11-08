// imports
const fs = require('fs');
const StegitLib = require('./lib/stegit-lib.js');
const mlbcFn = require('./lib/mlbcFunction.js');
const Utils = require('./lib/dct.js');
const log = require('./lib/console-tweak.js');
const pushPhoto = require('./pushPhoto.js');
const pullPhoto = require('./pullPhoto.js');
const Promise = require('promise');
const Worker = require('webworker-threads').Worker;

const imagePool = ['mini.jpg', 'mini.jpg', 'mini.jpg', 'alvin.jpg', 'alvin.jpg', 'rio.jpg', 'rio.jpg', 'rio.jpg'];
const password = 'pass123';
process.stdin.setEncoding('utf8');
process.stdin.on('end', function() { process.stdout.write('Huston over and out!'); });
var count = 0;

process.stdin.on('readable', function() {
  const chunk = process.stdin.read();
  if (chunk == null || (chunk!==null && chunk.trim().length === 0)) {
    if (++count === 5) {
      count = 0;
      process.stdout.write('will you write something eventually will you?!');
    }
    return;
  }
  count=0;
  
  const message = chunk;
  const imagePath = __dirname + '/' + imagePool[parseInt(Math.floor(Math.random() * (imagePool.length - 1)))];
  log(imagePath);
  const imageData = fs.readFileSync(imagePath);
  
  // log('#1 - attempting to encode message into image with password: "' + password + '"');
  var imgDataUrlEncoded = Utils.encodeData(
	  StegitLib.getImageDataFromFile(imagePath), 75, Utils.createEncodingDctFunction(message, password, mlbcFn));

  var regex = /^data:.+\/(.+);base64,(.*)$/;
  var matches = imgDataUrlEncoded.match(regex);

  var ext = matches[1];
  var data = matches[2];
  var buffer = new Buffer(data, 'base64');
  fs.writeFileSync(__dirname + '/encoded-image.' + ext, buffer);
  // log('encoded file saved, process finished!\n');

  process.stdout.write('[you]: ' + chunk);

  // log('pushing photo to facebook');
  pushPhoto(__dirname + '/encoded-image.' + ext)
    .then(function(pushResult){
      process.stdout.write('[sent]');
    });
});

setInterval(function(){
  pullPhoto().
    then(function(pullResult) {
      //log('pull result was ' + pullResult);
      var encodedImagePath = pullResult;
      var buffEncodedImage = fs.readFileSync(encodedImagePath);
      var arrBuffer = new Uint8Array(buffEncodedImage)
      var message = Utils.decodeImageBuffer(arrBuffer, Utils.createDecodingDctFunction(password, mlbcFn));
      //log('message found is: ' + message);
      process.stdout.write('[update] ' + message);
    }).
    catch(function(){
      log('error on pull');
    });
}, 3 * 1000);

