var FB = require('fb');
var fs = require('fs');
var https = require('https'); //Https module of Node.js
var FormData = require('form-data'); //Pretty multipart form maker.
var readline = require('readline');

 
var access_token = 'CAACEdEose0cBADjKdIpWMEXmWJrQm0SFFDDBPCF81xXgK4lLmMl3VFOWMCojZA6aJePRgRhjnDzYbuJyPYucK4lylT6y6Wr1KAFE6w3Y2Jmy4gGENLKyh0eZBUfIb57RJ18stPxIDGotiZBP904eJWZBMeowUhdAwCCd19Ain0SLEF76oZA7CVoQI6B1Lnx6vtXZAitnQ7cwL5tpf5xYyd';

FB.setAccessToken(access_token);


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
  
  postPhoto(answer);  
  rl.close();

});

*/

function postPhoto (path) {
  var form = new FormData(); //Create multipart form
  form.append('file', fs.createReadStream(path+'.jpg')); //Put file
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
       console.log(res);
  });
   
  //Binds form to request
  form.pipe(request);
   
  //If anything goes wrong (request-wise not FB)
  request.on('error', function (error) {
       console.log(error);
  });
}


