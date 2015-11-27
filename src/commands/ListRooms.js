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

/*log('Rooms registeres:')
log('- Room 1')
log('- Room 2')
log('- Room 3')
log('- Room 4')
log('- Room 5')*/

SocialNetworkProvider.listRooms();   

setInterval(function(){
  SocialNetworkProvider.listRooms();    
}, REFRESH_PERIOD * 1000)
