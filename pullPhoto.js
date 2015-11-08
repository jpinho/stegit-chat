const FB = require('fb');
const mkdirp = require('mkdirp');
const fs = require('fs');
// const log = require('./lib/console-tweak.js');
const request = require('request');
const Promise = require('promise');
const log = require('./lib/console-tweak.js');

const access_token = 'CAACEdEose0cBACy07KYUg5rRA8ZAAwVPfCom2pNZAVSSJFh8reEFXZAdr2hjEgkuMtnUyZCbp9bLBZAvep4pWdcxPaKGgqGZALCQZCBVTBnZCQBND6LL8EyFZCuctY7zZAKCmlQLZCqF4gscADJrjZAXxipbp8Tx9IKlDihg91torqkQQrqWgiC8qOCZCxum74FY9GlqTjSgIboJMZC11gTV51Uv8Y';
FB.setAccessToken(access_token);
mkdirp('downloadedPics/', function(err) {});

function pullPhoto() {
  return new Promise(function (resolve, reject) {
    FB.api(
      '/me',
      'get',
      {"fields":"albums{name,count,photos.limit(999999){images}}"},
      function(response) {
        var lastAlbum =  response.albums.data[0];  
        var lastAlbumName = response.albums.data[0].name;
        var thisAlbumLength = response.albums.data[0].count;
        var latestPhotoIndex = thisAlbumLength - 1;
        
        /*response.albums.data[0].photos.data.map(function(dt){
          return dt.images[0].source;
        }).forEach(function(item, i){
          log(i+' - '+item);
        });
        */
        
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
