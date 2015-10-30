var FB = require('fb');

var access_token = 'CAACEdEose0cBAADPhjcOlA8wUeHZAZBO2VM9q6ln0RohlLTGu3wModHirwStkHuu59NpiCZC2VsGhP2pqbhkAUpxKGq9MyX4iYgPAOsi71Uab6jG79UVeIZAFA7iZCNv8Wr7iOiA9K3j16kP8RP7N0Xexm3aivv5tTxJwdqquiiGzQpIESAXErVLdqVrMfeTBCno217oZADwZDZD';

FB.setAccessToken(access_token);

FB.api('/me', 'get', {"fields":"albums{photos{images}}"}, function (res) {
  if(!res || res.error) {
    console.log(!res ? 'error occurred' : res.error);
    return;
  }
    
  var albumIndex;
  var albumsPhotoList = [];
  var numberOfAlbuns =  res.albums.data.length;
  for (albumIndex = 0; albumIndex < numberOfAlbuns; albumIndex++) {
	var numberOfPhotosPerAlbum = res.albums.data[albumIndex].photos.data.length;
    console.log("Album "+ albumIndex + " has " + numberOfPhotosPerAlbum + " photos.");
    albumsPhotoList[albumIndex] = res.albums.data[albumIndex].photos;
  }
  
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

  var currentPhotoIndex;
  var photoCount = 0;
  var albumCount = 0;
  var currentAlbum = [];
  var albumPhotoIndex;
  for (albumPhotoIndex = 0; albumPhotoIndex < albumsPhotoList.length; albumPhotoIndex++){
	console.log("Extracting photos of album " + albumPhotoIndex + '.');
	currentAlbum = albumsPhotoList[albumPhotoIndex].data;	
	for (currentPhotoIndex = 0; currentPhotoIndex < currentAlbum.length; currentPhotoIndex++) {
		console.log("Photo " + currentPhotoIndex +" of album " + albumPhotoIndex + " is being downloaded.");
		var currentPhotoURL = currentAlbum[currentPhotoIndex].images[0].source;	
			if(albumCount != albumsPhotoList.length-1){
				download( currentPhotoURL , 'downloadedPics/Album_'+ albumPhotoIndex + '-Photo ' + currentPhotoIndex +'.jpg', function(){				
				console.log('Photo ' + currentPhotoIndex + ' from album ' + albumCount + ' downloaded.');	
				});
				photoCount++;
			}else{
				download( currentPhotoURL , 'downloadedPics/Profile_photo ' + currentPhotoIndex +'.jpg', function(){
				console.log('Profile photo ' + currentPhotoIndex + ' downloaded.');			
				});
				photoCount++;
			}				
	}
	if(photoCount = currentAlbum.length){
			console.log('Done: All photos from album ' + albumPhotoIndex +' have been downloaded.');
			albumCount++;
			photoCount=0;
	}	
   }
});