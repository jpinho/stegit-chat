// imports
const fs = require('fs')
const StegitLib = require('./lib/stegit-lib.js')
const mlbcFn = require('./lib/mlbcFunction.js')
const Utils = require('./lib/dct.js')
const log = require('./lib/console-tweak.js')
const SocialNetworkProvider = require('./providers/facebook.js')
const Promise = require('promise')
const Worker = require('webworker-threads').Worker

const imagePool = ['mini.jpg', 'mini.jpg', 'mini.jpg', 'alvin.jpg', 'alvin.jpg', 'rio.jpg', 'rio.jpg', 'rio.jpg'];
const password = 'pass123';
process.stdin.setEncoding('utf8');
process.stdin.on('end', function() { process.stdout.write('Huston over and out!'); });
var DateofLastPhoto = 0;

process.stdin.on('readable', function() {
  const chunk = process.stdin.read();
  if (chunk == null || (chunk!==null && chunk.trim().length === 0)) {
    return;
  }

  var date = new Date().getTime();
  date = Math.floor(date / 1000 );
  // set the date of the last photo uplodaded, so the console don't print twice
  DateofLastPhoto = date;
  const message ={'text': chunk, 'timestamp': date};
  const imagePath = __dirname + '/' + imagePool[parseInt(Math.floor(Math.random() * (imagePool.length - 1)))];

  const imageData = fs.readFileSync(imagePath);

  // log('#1 - attempting to encode message into image with password: "' + password + '"');
  var imgDataUrlEncoded = Utils.encodeData(
	  StegitLib.getImageDataFromFile(imagePath), 75, Utils.createEncodingDctFunction(JSON.stringify(message), password, mlbcFn));

  var regex = /^data:.+\/(.+);base64,(.*)$/
  var matches = imgDataUrlEncoded.match(regex)

  var ext = matches[1];
  var data = matches[2];
  var buffer = new Buffer(data, 'base64');
  fs.writeFileSync(__dirname + '/encoded-image.' + ext, buffer);
  // log('encoded file saved, process finished!\n');

  //process.stdout.write('[you]: ' + chunk);

  // log('pushing photo to facebook')
  SocialNetworkProvider.pushPhoto(__dirname + '/encoded-image.' + ext)
    .then(function(pushResult){
      //process.stdout.write('[sent]');
    });
});

setInterval(function(){
  SocialNetworkProvider.pullPhoto().
    then(function(pullResult) {
      //log('pull result was ' + pullResult);
      var encodedImagePath = pullResult;
      var buffEncodedImage = fs.readFileSync(encodedImagePath);
      var arrBuffer = new Uint8Array(buffEncodedImage)
      var message = Utils.decodeImageBuffer(arrBuffer, Utils.createDecodingDctFunction(password, mlbcFn));

      //log('message found is: ' + message);
      var messageParsed = JSON.parse(message);

      // not the best way TODO, improve later
      if(DateofLastPhoto < messageParsed.timestamp){
        process.stdout.write('[update] ' + messageParsed.text );
        DateofLastPhoto = messageParsed.timestamp;
      }
    }).
    catch(function(){
      log('error on pull');
    });
}, 3 * 1000);
