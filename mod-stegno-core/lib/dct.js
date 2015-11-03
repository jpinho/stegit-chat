/**
 * DCT module from secretbook.
 * @ported-by João Pinho
 */
require('./mlbc.js');
require('./seedRandom.js');

module.exports = (function() {
  const JPEGEncoder = require('./jpg_encoder.js');
  const JpegImage = require('./jpg_decoder.js');
  const Canvas = require('canvas');
  const Image = Canvas.Image;

  this.encodeData = function(theImgData, qf, dctFunction) {
    var encoder, jpegURI;
    encoder = new JPEGEncoder();
    jpegURI = encoder.encode(theImgData, qf, dctFunction);
    return jpegURI;
  };

  this.decodeImage = function(url, decodingFunction) {
    var j;
    j = new JpegImage();
    j.onload = function(DU_DCT_ARRAY) {
      if (DU_DCT_ARRAY[0] === undefined) {
        return decodingFunction(DU_DCT_ARRAY[1], DU_DCT_ARRAY[1].length);
      } else {
        return decodingFunction(DU_DCT_ARRAY[0], DU_DCT_ARRAY[0].length);
      }
    };
    return j.load(url, true);
  };

  this.encodingDctFunction = function(DU_DCT_ARRAY, blocks, message, password, mlbc) {
    var LUMA_ARRAY, coeffs, coeffsToStuckBitStream, errorRateCaused, makeChanges, messageToHide, stream, stuckBitErrors;

    makeChanges = function(messageToHide, LUMA_ARRAY) {
      var i, pos, stuckBitErrors;
      stuckBitErrors = 0;
      i = 0;
      while (i < messageToHide.length) {
        pos = intToPair(coeffs[i]);
        if (Math.abs(LUMA_ARRAY[pos.block][pos.k] % 2) !== messageToHide[i]) {
          if (LUMA_ARRAY[pos.block][pos.k] !== 0) {
            if (LUMA_ARRAY[pos.block][pos.k] < 0) {
              LUMA_ARRAY[pos.block][pos.k] += 1;
            } else {
              LUMA_ARRAY[pos.block][pos.k] -= 1;
            }
          } else {
            stuckBitErrors++;
          }
        }
        i++;
      }
      return stuckBitErrors;
    };

    coeffsToStuckBitStream = function(coeffs, LUMA_ARRAY) {
      var i, pos, stream;

      stream = [];
      i = 0;
      while (i < coeffs.length) {
        pos = intToPair(coeffs[i]);
        if (LUMA_ARRAY[pos.block][pos.k] === 0) {
          stream.push(0);
        } else {
          stream.push(1);
        }
        i++;
      }
      return stream;
    };

    LUMA_ARRAY = DU_DCT_ARRAY[0];
    coeffs = getValidCoeffs(LUMA_ARRAY, blocks);
    console.log("We have " + coeffs.length + " coeffs within to encode data");
    shuffle(coeffs, password);
    stream = coeffsToStuckBitStream(coeffs, LUMA_ARRAY);
    messageToHide = encodeLongMessage(mlbc, message, stream);
    stuckBitErrors = makeChanges(messageToHide, LUMA_ARRAY);
    errorRateCaused = stuckBitErrors / messageToHide.length;
    return console.log("We caused " + stuckBitErrors + " (" + errorRateCaused * 100 + "%) errors to occur in unavoidable stuck bits");
  };

  this.decodingDctFunction = function(LUMA_ARRAY, blocks, password, mlbc) {
    var coeffs, coeffsToStream, message, stream;
    coeffsToStream = function(coeffs, LUMA_ARRAY) {
      var i, pos, stream, _i, _ref;

      stream = [];
      i = 0;
      for (i = _i = 0, _ref = coeffs.length - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; i = 0 <= _ref ? ++_i : --_i) {
        pos = intToPair(coeffs[i]);
        stream.push(Math.abs(LUMA_ARRAY[pos.block][pos.k] % 2));
      }
      return stream;
    };
    coeffs = getValidCoeffs(LUMA_ARRAY, blocks);
    console.log(coeffs.length + " coefficients were available for storing.");
    console.log(coeffs.slice(0));
    shuffle(coeffs, password);
    console.log(coeffs.slice(0));
    stream = coeffsToStream(coeffs, LUMA_ARRAY);
    console.log(stream);
    message = decodeLongMessage(mlbc, stream);
    return message;
  };

  this.createEncodingDctFunction = function(message, password, mlbc) {
    return function(DU_DCT_ARRAY, blocks) {
      return encodingDctFunction(DU_DCT_ARRAY, blocks, message, password, mlbc);
    };
  };

  this.createDecodingDctFunction = function(password, mlbc) {
    return function(DU_DCT_ARRAY, blocks) {
      return decodingDctFunction(DU_DCT_ARRAY, blocks, password, mlbc);
    };
  };

  this.getValidCoeffs = function(arr, blocks) {
    var block, coeffs, k, _i;

    coeffs = [];
    block = 0;
    while (block < blocks) {
      for (k = _i = 1; _i <= 1; k = ++_i) {
        coeffs.push(pairToInt(block, k));
      }
      block++;
    }
    return coeffs;
  };

  this.intToPair = function(i) {
    var block, k;

    block = Math.floor(i / 64);
    k = i % 64;
    return {
      block: block,
      k: k
    };
  };

  this.pairToInt = function(block, k) {
    return 64 * block + k;
  };

  this.random = function(from, to) {
    return from + Math.floor(0.5 + Math.random() * (to - from));
  };

  this.shuffle = function(arr, password) {
    var i, j, swap;

    Math.seedrandom(password);
    i = arr.length - 1;
    while (i > 0) {
      j = random(0, i);
      swap = arr[j];
      arr[j] = arr[i];
      arr[i] = swap;
      i--;
    }
    Math.seedrandom();
    return arr;
  };

  this.getImageDimensions = function(url) {
    var img, self = this;
    img = new Image();
    img.src = url;
    var ctx, cvs;

    cvs = new Canvas(200, 200);
    cvs.width = img.width;
    cvs.height = img.height;
    ctx = cvs.getContext("2d");
    ctx.drawImage(img, 0, 0);
    self.resizeImage(cvs);
    
    return {
      width: cvs.width,
      height: cvs.height
    };
  };

  this.encodeCanvas = function(canvas, qf, dctFunction) {
    var ctx, cvs, theImgData;

    cvs = canvas;
    ctx = cvs.getContext("2d");
    theImgData = ctx.getImageData(0, 0, cvs.width, cvs.height);
    return encodeData(theImgData, qf, dctFunction);
  };

  return this;
})();
