var FB = require('fb');
var access_token = 'CAACEdEose0cBAJ35bZAWZCXgBVdm8QVZBVfSPilwCr2uDoaS3KdLgUmaiLq0WyQG4GhM9ZAVqFYAZBJM551f8jffkhTUz3VpAOJjq9ZBHtNpcOAH7uQIBY8lVimfcfUSb8fAbIEnALB91CUZAOUtMVTDG5QXggrSnwigDi2RpHWgCVCc85ZCYdxriZClxXrxMip0xW8OKxfCL9TwxA0OXCxbY';

FB.setAccessToken(access_token);

var body = 'My first post using facebook-node-sdk';
FB.api('me/feed', 'post', { message: body}, function (res) {
  if(!res || res.error) {
    console.log(!res ? 'error occurred' : res.error);
    return;
  }
  console.log('Post Id: ' + res.id);
});