var FB = require('fb');
var access_token = 'CAACEdEose0cBAIMWZBU591wHhTO6nSj7fex9nYLpUnOMhkZAnDUyyGKiWZAAKcePSCwNEsh0YGTZCHHzvkZBKGL7zw6mkzXv8Us6kDZCZAj6rlp3ZAY8UuBEMQPbUCCfCvdLHgVZBCsYx1fZCAKNZAhjEyU6jbWNINiy18ngH07b5vY9tDUcrkwfWIuvpxtpaxxsyeMaXevVCdy65yAoVykZCZCd8';

FB.setAccessToken(access_token);


var fs = require('fs');
var https = require('https'); //Https module of Node.js
var FormData = require('form-data'); //Pretty multipart form maker.
 
var form = new FormData(); //Create multipart form
form.append('file', fs.createReadStream('test.jpg')); //Put file
form.append('message', "Meti uma foto via https"); //Put message
 
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

