// imports
const fs = require('fs');
const StegitLib = require('./lib/stegit-lib.js');
const mlbcFn = require('./lib/mlbcFunction.js');
const Utils = require('./lib/dct.js');
const log = require('./lib/console-tweak.js');
const pushPhoto = require('./pushPhoto.js');
const pullPhoto = require('./pullPhoto.js');
const Promise = require('promise');

var imagePath = __dirname + '/mini.jpg';
var message = 'Hello Mars!';
var password = 'pass123';
var imageData = fs.readFileSync(imagePath);

/**
 * Objective 1
 */
log('#1 - attempting to encode message into image with password: "' + password + '"');
var imgDataUrlEncoded = Utils.encodeData(
	StegitLib.getImageDataFromFile(imagePath), 75, Utils.createEncodingDctFunction(message, password, mlbcFn));

var regex = /^data:.+\/(.+);base64,(.*)$/;
var matches = imgDataUrlEncoded.match(regex);

var ext = matches[1];
var data = matches[2];
var buffer = new Buffer(data, 'base64');
fs.writeFileSync(__dirname + '/encoded-image.' + ext, buffer);
log('encoded file saved, process finished!\n');

// Objective 1.a)
log('pushing photo to facebook');
pushPhoto(__dirname + '/encoded-image.' + ext)
  .then(function(pushResult){
    log('push result was ' + pushResult);

    /**
     * Objective 2 
     */

    log('#2 - attempting to decode image (pulled from FB) and extract message with password: "' + password + '"');
    pullPhoto().
      then(function(pullResult) {
        log('pull result was ' + pullResult);
        var encodedImagePath = pullResult;
        var buffEncodedImage = fs.readFileSync(encodedImagePath);
        var arrBuffer = new Uint8Array(buffEncodedImage)
        var message = Utils.decodeImageBuffer(arrBuffer, Utils.createDecodingDctFunction(password, mlbcFn));
        log('message found is: "' + message + '"');
      }).
      catch(function(){
        console.log('error on pull');
      });
  }).
  catch(function(){
    console.log(arguments);
  });

