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

/*
log('New room generated:')
log('- uri: http://...')
log('- secret: ...')*/

//SocialNetworkProvider.generateRoom();   

setInterval(function(){
  SocialNetworkProvider.generateRoom();    
}, REFRESH_PERIOD * 1000)
