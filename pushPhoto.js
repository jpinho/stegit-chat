const FB = require('fb');
const fs = require('fs');
const https = require('https'); //Https module of Node.js
const FormData = require('form-data'); //Pretty multipart form maker.
const readline = require('readline');
const Promise = require('promise');

// for a readable Stream
//https://nodejs.org/api/process.html#process_process_stdin

/*
var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question("Type a photo url to upload ", function(answer) {
  // TODO: Log the answer in a database
  console.log("Url: ", answer );
  
  pushPhoto(answer);  
  rl.close();

});

*/

const access_token = 'CAACEdEose0cBAJSjKzMeSoEgD0p4tEtKZA4oEGQgjX8ipU9bGdQEZC3bYSMbK08tlNSuEodCyIHfA4KfudMZAHoKZBR10HXiZBMdrXca7X5MiUw0g1XCVGC5lKxa4PBmwLTvcQugGsmOrZCWPkuBFnp9vCZCDWitCnm0PQ8ZBXusqX1RZButBhoWr3hs5VjIDUs7W6CDmgcUHRlNn4yntjK0x';
FB.setAccessToken(access_token);

function pushPhoto (path) {
  return new Promise(function(resolve, reject){
    var form = new FormData(); //Create multipart form
    form.append('file', fs.createReadStream(path)); //Put file
    form.append('message', "Me gusta"); //Put message
     
    //POST request options, notice 'path' has access_token parameter
    var options = {
        method: 'post',
        host: 'graph.facebook.com',
        path: '/138719479819169/photos?access_token='+access_token,
        headers: form.getHeaders(),
    }
     
    //Do POST request, callback for response
    var request = https.request(options, function (res){
      resolve('ok');
      console.log(res);
    });
     
    //Binds form to request
    form.pipe(request);
     
    //If anything goes wrong (request-wise not FB)
    request.on('error', function (error) {
      reject('ko');
      console.log(error);
    });
  });    
};

module.exports = pushPhoto;

