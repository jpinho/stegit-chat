const fs = require('fs')
const path = require('path')
const log = require('../components/helpers/console-tweak.js')
const name = process.argv.slice(2);

fs.writeFile('./src/commands/resources/user.txt', name, function(err) {

  if(err) {
    log(err);
  }
log('Username changed to ' + name);
});

