var FB = require('fb');
const readline = require('readline');

var access_token = 'CAACEdEose0cBALduo87iZCgmR9WaDiLO8qsvpk28OAd0EDkZB6Anr7LZAcbDWGWbDYFYI2tI2ILpeqWritzWWA6mgK40Bzz8zVPfZAhq6BQvZAkZAcjQYmHBPI86n3f1KqeIVJTZBSdXQGoFSxon3vz0KsO89YxahAvqZC2yt7JgE2ZC7vkns76h32AB5tMq0JX9C1DHBuZCRzMJuM4ZBdtkk3K';
FB.setAccessToken(access_token);

var albumName = '';
var albumDescription = 'descriptionTest';
//Privacy options: EVERYONE, ALL_FRIENDS, NETWORKS_FRIENDS, FRIENDS_OF_FRIENDS, CUSTOM 
var privacy = 'EVERYONE';

function createRoom() {
  return new Promise(function (resolve, reject) {
     var rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
     });
     rl.question("Type the name of the new album ", function(answer) {
         console.log("Name: ", answer );
         albumName =  answer;
         FB.api(
           "/me/albums",
           "post",
           { 
           //"fields":"albums{id}"      
           "name": albumName,
           "message": albumDescription,
           "privacy": {'value': privacy}
           },
           function (response) {                     
             if(!response || response.error) {
                console.log(!response ? 'error: No album created' : response.error);
                reject(response.error);
                return;
             }
            resolve('ok');
           }
          );
        rl.close();
     });
  });
}
    createRoom().then(function(response) {
      FB.api(
         "/me",
         "get",
        {
        'fields': 'albums{name,id}'
        },
        function (response) {
          var albumID = response.albums.data[0].id;
          console.log('ID is: ' + albumID);
          if(!response || response.error) {
              console.log(!response ? 'error: Could not retrieve album ID' : response.error);
              return;
           } 
        }
      );
    });
//createNewRoom();
module.exports = {
  createRoom: createRoom
}


