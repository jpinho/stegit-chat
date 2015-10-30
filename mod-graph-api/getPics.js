var FB = require('fb');

var access_token = 'CAACEdEose0cBAORBRLFeltBf4cvmBYtULiOorUyiFnf9YDSHxH76SHgiZAOUILCJFLfQY1zhPc4hSk02zv0hWR7BSRPly2WZAq8VnqnZA9Pv6ZBo2ZAtkjy5g6bRtjPIiULM2uMine5Wiul6OPdV11cQ8u51AsYtsV4qMllFnPXxTNYQlkj6SwA3b6Xv9hBcGZADgdpFykVAZDZD';

FB.setAccessToken(access_token);

FB.api('/me', 'get', {"fields":"albums{photos{images}}"}, function (res) {
  if(!res || res.error) {
    console.log(!res ? 'error occurred' : res.error);
    return;
  }
    
  var albumIndex;
  var albumsPhotoList = [];   
  for (albumIndex = 0; albumIndex <= res.albums.data.length-1; albumIndex++) {
    console.log("Album "+ albumIndex + " has " + res.albums.data[albumIndex].photos.data.length + " photos");
    albumsPhotoList[albumIndex] = res.albums.data[albumIndex].photos;
  }
  
  var fs = require('fs'),
  request = require('request');

  var download = function(uri, filename, callback){
    request.head(uri, function(err, res, body){
    console.log('content-type:', res.headers['content-type']);
    console.log('content-length:', res.headers['content-length']);
    request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
    });
  };

  var currentPhotoIndex;
  var photoCount = 0;
  var albumCount=0;
  var currentAlbum = [];
  var albumPhotoIndex;
  for (albumPhotoIndex = 0; albumPhotoIndex < albumsPhotoList.length; albumPhotoIndex++){
	console.log("Extracting photos of album " + albumPhotoIndex);
	currentAlbum = albumsPhotoList[albumPhotoIndex].data;	
	for (currentPhotoIndex = 0; currentPhotoIndex < currentAlbum.length; currentPhotoIndex++) {
		console.log("Photo " + currentPhotoIndex +" of album " + albumPhotoIndex + " is being downloaded");
		var currentPhotoURL = currentAlbum[currentPhotoIndex].images[0].source;	
			if(albumCount != albumsPhotoList.length -1){
				download( currentPhotoURL , 'downloadedPics/Album_'+ albumPhotoIndex + '-Photo ' + currentPhotoIndex +'.jpg', function(){
				photoCount++;
				console.log('Photo ' + photoCount + ' from album ' + albumPhotoIndex + ' downloaded.');	
				});
			}else{
				download( currentPhotoURL , 'downloadedPics/Profile_photo ' + currentPhotoIndex +'.jpg', function(){
				photoCount++;
				console.log('Profile photo ' + currentPhotoIndex + ' downloaded.');			
				});
			} 					
	}
	if(photoCount = currentAlbum.length){
			console.log('Done: All photos from album ' + albumPhotoIndex +' have been downloaded.');
			photoCount=0;
	}	
   }
});