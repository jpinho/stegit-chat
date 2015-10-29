var FB = require('fb');

var access_token = 'CAACEdEose0cBAJ35bZAWZCXgBVdm8QVZBVfSPilwCr2uDoaS3KdLgUmaiLq0WyQG4GhM9ZAVqFYAZBJM551f8jffkhTUz3VpAOJjq9ZBHtNpcOAH7uQIBY8lVimfcfUSb8fAbIEnALB91CUZAOUtMVTDG5QXggrSnwigDi2RpHWgCVCc85ZCYdxriZClxXrxMip0xW8OKxfCL9TwxA0OXCxbY';

FB.setAccessToken(access_token);

FB.api('/me', 'get', {"fields":"albums{photos{images}}"}, function (res) {
  if(!res || res.error) {
    console.log(!res ? 'error occurred' : res.error);
    return;
  }
  var theUrl= res.albums.data[0].photos.data[0].images[0].source; 
  
  var fs = require('fs'),
    request = require('request');

var download = function(uri, filename, callback){
  request.head(uri, function(err, res, body){
    console.log('content-type:', res.headers['content-type']);
    console.log('content-length:', res.headers['content-length']);

    request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
  });
};

download( theUrl , 'albums/test.jpg', function(){
  console.log('done');
});
  
});