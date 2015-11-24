const fs = require('fs')
const path = require('path')
const log = require('../components/helpers/console-tweak.js')

log(fs.readFileSync(path.join(__dirname, 'resources', 'Banner.info'), 'utf8'));
