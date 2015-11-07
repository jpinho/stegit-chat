// imports
const fs = require('fs');
const StegitLib = require('./lib/stegit-lib.js');
const mlbcFn = require('./lib/mlbcFunction.js');
const Utils = require('./lib/dct.js');
const log = require('./lib/console-tweak.js');

var imagePath = __dirname + '/alvin.jpg';
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


/**
 * Objective 2 
 */
log('#2 - attempting to decode image and extract message with password: "' + password + '"');
var encodedImagePath = __dirname + '/encoded-image.' + ext
var buffEncodedImage = fs.readFileSync(encodedImagePath);
var arrBuffer = new Uint8Array(buffEncodedImage)
var message = Utils.decodeImageBuffer(arrBuffer, Utils.createDecodingDctFunction(password, mlbcFn));
log('message found is: "' + message + '"');
