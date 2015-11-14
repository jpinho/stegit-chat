const FB = require('fb')
const mkdirp = require('mkdirp')
const fs = require('fs')
const request = require('request')
const Promise = require('promise')
const https = require('https'); // Https module of Node.js
const FormData = require('form-data'); // Pretty multipart form maker.
const NewRoom = require('./createRoom.js');

var access_token = 'CAACEdEose0cBALduo87iZCgmR9WaDiLO8qsvpk28OAd0EDkZB6Anr7LZAcbDWGWbDYFYI2tI2ILpeqWritzWWA6mgK40Bzz8zVPfZAhq6BQvZAkZAcjQYmHBPI86n3f1KqeIVJTZBSdXQGoFSxon3vz0KsO89YxahAvqZC2yt7JgE2ZC7vkns76h32AB5tMq0JX9C1DHBuZCRzMJuM4ZBdtkk3K';
FB.setAccessToken(access_token);

function testRoom() {
     /* NewRoom.createRoom().then(function(response){
            console.log('The response is: ' + response);
        });*/
  
}    

NewRoom.createRoom();
