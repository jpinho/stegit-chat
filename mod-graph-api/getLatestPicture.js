var FB = require('fb');

var access_token = 'CAACEdEose0cBAADPhjcOlA8wUeHZAZBO2VM9q6ln0RohlLTGu3wModHirwStkHuu59NpiCZC2VsGhP2pqbhkAUpxKGq9MyX4iYgPAOsi71Uab6jG79UVeIZAFA7iZCNv8Wr7iOiA9K3j16kP8RP7N0Xexm3aivv5tTxJwdqquiiGzQpIESAXErVLdqVrMfeTBCno217oZADwZDZD';
FB.setAccessToken(access_token);



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

