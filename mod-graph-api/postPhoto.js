var FB = require('fb');
var fs = require('fs');
var https = require('https'); //Https module of Node.js
var FormData = require('form-data'); //Pretty multipart form maker.
var readline = require('readline');

 
var access_token = 'CAACEdEose0cBAMCu9ilZCgbpUQA4fSXH4KYbFqbFZARnyZBJMEufxxMGYWOf5PgkGPNcDy6hvQkdZCLtPZACDYANxusBoSfNG4sY7kVxvXG7sTjJc3nIn6s1uLKN0PdZACUqQNJHIUbJPAhi7tCfUZBPpIIu6dsPBKESrluZA0MlfCx8A2xLYDocOHF49qa4sm3zkhwQf8iYJHMZBz5YZCxks3';

FB.setAccessToken(access_token);
console.log('hello');


// for a readable Stream
//https://nodejs.org/api/process.html#process_process_stdin

var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question("Type a photo url to upload ", function(answer) {
  // TODO: Log the answer in a database
  console.log("Url: ", answer );
  
  postPhoto(answer);  
  rl.close();

});



function postPhoto (url) {
  var form = new FormData(); //Create multipart form
  form.append('file', fs.createReadStream(url)); //Put file
  form.append('message', "Me gusta"); //Put message
   
  //POST request options, notice 'path' has access_token parameter
  var options = {
      method: 'post',
      host: 'graph.facebook.com',
      path: '/me/photos?access_token='+access_token,
      headers: form.getHeaders(),
  }
   
  //Do POST request, callback for response
  var request = https.request(options, function (res){
       console.log(res);
  });
   
  //Binds form to request
  form.pipe(request);
   
  //If anything goes wrong (request-wise not FB)
  request.on('error', function (error) {
       console.log(error);
  });
}


