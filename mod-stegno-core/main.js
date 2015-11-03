// imports
const fs = require('fs');

const StegitLib = require('./lib/stegit-lib.js');
const mlbcFn = require('./lib/mlbcFunction.js');
const Utils = require('./lib/dct.js');

var imagePath = __dirname + '/alvin.jpg';
var message = 'Hello Mars!';
var password = 'pass123';
var imageData = fs.readFileSync(imagePath, 'utf8');

//# Objective 1 #
var imgDataUrlEncoded = Utils.encodeData(StegitLib.getImageDataFromFile(imagePath), 75,
	Utils.createEncodingDctFunction(message, password, mlbcFn));

var regex = /^data:.+\/(.+);base64,(.*)$/;
var matches = imgDataUrlEncoded.match(regex);

var ext = matches[1];
var data = matches[2];
var buffer = new Buffer(data, 'base64');
fs.writeFileSync('encoded-image.' + ext, buffer);
console.log('encoded file saved');

//# Objective 2 #
//var message = decodeImage(url, createDecodingDctFunction(password, mlbcFn));
