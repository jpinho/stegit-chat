const fs = require('fs')
const path = require('path')
const log = require('../components/helpers/console-tweak.js')

var roomsList = [];
var room = process.argv.slice(2)[0];
var password = process.argv.slice(2)[1];

fs.readFile('./src/commands/resources/rooms.txt', 'utf8', function (err,data) {
  if (err) {
    log(err);
  }
  if(data !== ''){
    dataFromFile = JSON.parse(data);
    //log('dataFromFile ' + JSON.stringify(dataFromFile));
    for(var  x in dataFromFile){
      //log('data ' +dataFromFile[x]);
      roomsList.push(dataFromFile[x]);
    }
    addRoomToFile();
  } else {
    addRoomToFile();
  }
});

function addRoomToFile(){
  var file = {room: room, password: password};
  roomsList.push(file);
  //log('ROOMSLIST ' + roomsList);
  storeFile(JSON.stringify(roomsList));
  //log(JSON.stringify(roomsList));
}


function storeFile(file){
  fs.writeFile('./src/commands/resources/rooms.txt', file, function(err) {

    if(err) {
      log(err);
    }
  log('Added room.');
  });
}
