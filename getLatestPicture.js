const FB = require('fb');
const mkdirp = require('mkdirp');
const fs = require('fs');
const request = require('request');

var access_token = 'CAACEdEose0cBAHbpOEwiwikmEs7rZAH16Ypu73hu16ZAb2ixgBelK9VF5tEZCfPXUYbK48GMU6o19PrdwNtkoOWaBw0R1H7bl3n8zZC7buxLkZC32H5HaRBpK1Dpyo7tZBnmeZC0DyhY2xW953LQZAQMl8ujqimuhDyPzgsUZAIB6u5EQ2WZBisO504CDUtGcZAvtm7jAvQjpGCtAZDZD';
FB.setAccessToken(access_token);

mkdirp('downloadedPics/', function(err) { 

    // path was created unless there was error

});

FB.api(
  '/me',
  'get',
  {"fields":"albums{name,id,count,photos{images}}"},
  function(response) {
    // Insert your code here
    //console.log(response.albums.data);
    var lastAlbum =  response.albums.data[0];  
    var lastAlbumName = response.albums.data[0].name;
    var thisAlbumLength = response.albums.data[0].count;
    var latestPhotoIndex = --thisAlbumLength;
    var lastPhotoUploadedUrl = response.albums.data[0].photos.data[latestPhotoIndex].images[0].source;
    console.log('The album ' + lastAlbumName + ' is the latest album created.');
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
    download(lastPhotoUploadedUrl , 'downloadedPics/Latest_Photo.jpg', function(){				
		  console.log('The last photo from the album ' + lastAlbumName + ' has been downloaded.');	
	  });
  }
);

