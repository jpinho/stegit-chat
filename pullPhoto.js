const FB = require('fb');
const mkdirp = require('mkdirp');
const fs = require('fs');
// const log = require('./lib/console-tweak.js');
const request = require('request');
const Promise = require('promise');

const access_token = 'CAACEdEose0cBAJSjKzMeSoEgD0p4tEtKZA4oEGQgjX8ipU9bGdQEZC3bYSMbK08tlNSuEodCyIHfA4KfudMZAHoKZBR10HXiZBMdrXca7X5MiUw0g1XCVGC5lKxa4PBmwLTvcQugGsmOrZCWPkuBFnp9vCZCDWitCnm0PQ8ZBXusqX1RZButBhoWr3hs5VjIDUs7W6CDmgcUHRlNn4yntjK0x';
FB.setAccessToken(access_token);
mkdirp('downloadedPics/', function(err) {});

function pullPhoto() {
  return new Promise(function (resolve, reject) {
    FB.api(
      '/me',
      'get',
      {"fields":"albums{name,id,count,photos{images}}"},
      function(response) {
        var lastAlbum =  response.albums.data[0];  
        var lastAlbumName = response.albums.data[0].name;
        var thisAlbumLength = response.albums.data[0].count;
        var latestPhotoIndex = --thisAlbumLength;
        var lastPhotoUploadedUrl = response.albums.data[0].photos.data[latestPhotoIndex].images[0].source;
        console.log('The album ' + lastAlbumName + ' is the latest album created.');
        
        var download = function(uri, filename, callback){
          request.head(uri, function(err, res, body){
            if (typeof res === 'undefined') {
              reject('Download headers request failed.');
            }
          
	          //For debug purposes        
	          if(res.headers['content-type'] != 'image/jpeg'){
		          console.log('content-type:', res.headers['content-type']);
		          console.log('content-length:', res.headers['content-length']);	
	          }      
	          
            request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);  
          });
        };    
        
        download(lastPhotoUploadedUrl , 'downloadedPics/Latest_Photo.jpg', function(){			
          resolve('./downloadedPics/Latest_Photo.jpg');	
		      console.log('The last photo from the album ' + lastAlbumName + ' has been downloaded.');	
	      });
      }
    );
  });
}
  
module.exports = pullPhoto;  

