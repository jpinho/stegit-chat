'use strict'

const fs = require('fs')
const path = require('path')
const ImageUtils = require('../components/helpers/image-utils.js')
const mlbcFn = require('../components/encoding/mlbc-fn.js')
const DecodingUtils = require('../components/encoding/dct.js')
const log = require('../components/helpers/console-tweak.js')
const SocialNetworkProvider = require('../components/providers/facebook.js')
const Promise = require('promise')

const REFRESH_PERIOD = 3
const imagePool = ['mini.jpg', 'mini.jpg', 'mini.jpg', 'alvin.jpg', 'alvin.jpg', 'rio.jpg', 'rio.jpg', 'rio.jpg']
const password = 'pass123'
const roomNumber = process.argv.slice(2);
var username = 'anonymous';
fs.readFile('./src/commands/resources/user.txt', 'utf8', function (err,data) {
  if (err) {
    log(err);
  }
  username = data;
  startChat();
});

function startChat() {
  log('You just joined to a new room '+ roomNumber + ' as username: ' + username +'\n');
  process.stdin.setEncoding('utf8')
  let DateofLastPhoto = 0

  process.stdin.on('readable', function() {
    const chunk = process.stdin.read()
    if (chunk == null || (chunk!==null && chunk.trim().length === 0)) {
      return
    }

    let nRetries = 5
    while (nRetries > 0) {
      var date = new Date().getTime()
      date = Math.floor(date / 1000)
      // set the date of the last photo uplodaded, so the console don't print twice
      DateofLastPhoto = date
      const message ={'text': chunk, 'timestamp': date}
      const imagePath = path.join('./media', imagePool[parseInt(Math.floor(Math.random() * (imagePool.length - 1)))])
      const imageData = fs.readFileSync(imagePath)

      try {
        var imgDataUrlEncoded = DecodingUtils.encodeData(
      	  ImageUtils.getImageDataFromFile(imagePath), 75, DecodingUtils.createEncodingDctFunction(JSON.stringify(message), password, mlbcFn))

        var regex = /^data:.+\/(.+)base64,(.*)$/
        var matches = imgDataUrlEncoded.match(regex)

        var ext = matches[1]
        var data = matches[2]
        var buffer = new Buffer(data, 'base64')
        fs.writeFileSync(path.join('./temp', 'encoded-image.' + ext), buffer)

        // log('encoded file saved, process finished!\n')
        // process.stdout.write('[you]: ' + chunk)

        nRetries = 0
        SocialNetworkProvider.pushPhoto(path.join('./temp', 'encoded-image.' + ext))
          .then(function(pushResult){
            // process.stdout.write('[sent]')
          })
      }
      catch (ex) {
        if (--nRetries === 0) {
          log('message send failed')
        }
      }
    }
  })

  setInterval(function(){
    SocialNetworkProvider.pullPhoto().
      then(function(pullResult) {
        var encodedImagePath = pullResult
        var buffEncodedImage = fs.readFileSync(encodedImagePath)
        var arrBuffer = new Uint8Array(buffEncodedImage)
        var message = DecodingUtils.decodeImageBuffer(arrBuffer, DecodingUtils.createDecodingDctFunction(password, mlbcFn))

        var messageParsed = JSON.parse(message)

        if(DateofLastPhoto < messageParsed.timestamp){
          process.stdout.write('[update] ' + messageParsed.text )
          DateofLastPhoto = messageParsed.timestamp
        }
      })
  }, REFRESH_PERIOD * 1000)
}

