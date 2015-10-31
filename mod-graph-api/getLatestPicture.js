var FB = require('fb');
var mkdirp = require('mkdirp');
var access_token = 'CAACEdEose0cBAIMWZBU591wHhTO6nSj7fex9nYLpUnOMhkZAnDUyyGKiWZAAKcePSCwNEsh0YGTZCHHzvkZBKGL7zw6mkzXv8Us6kDZCZAj6rlp3ZAY8UuBEMQPbUCCfCvdLHgVZBCsYx1fZCAKNZAhjEyU6jbWNINiy18ngH07b5vY9tDUcrkwfWIuvpxtpaxxsyeMaXevVCdy65yAoVykZCZCd8';
FB.setAccessToken(access_token);

mkdirp('downloadedPics/', function(err) { 

    // path was created unless there was error

});

FB.api(
  '/me',
  'gET',
  {"fields":"albums{created_time,name,photos}"},
  function(response) {
      // Insert your code here
  
  var LastAlbum =  response.albums.data[0];  
  var LastAlbumName = response.albums.data[0].name;
  var LastPhotoUploadedUrl = response.albums.data[0].photos.data[0].images[0].source;
  console.log('The album ' + LastAlbumName + ' is the latest album created.');
   
  var fs = require('fs'),
  request = require('request');

  var download = function(uri, filename, callback){
    request.head(uri, function(err, res, body){
	//For debug purposes
	if(res.headers['content-type'] != 'image/jpeg'){
		console.log('content-type:', res.headers['content-type']);
		console.log('content-length:', res.headers['content-length']);	
	}    
    request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
    });
  };
  
  download(LastPhotoUploadedUrl , 'downloadedPics/Latest_Photo.jpg', function(){				
				console.log('The last photo from the album ' + LastAlbumName + ' has been downloaded.');	
				});
  
});

