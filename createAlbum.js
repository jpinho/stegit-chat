var FB = require('fb');

var access_token = 'CAACEdEose0cBAHbpOEwiwikmEs7rZAH16Ypu73hu16ZAb2ixgBelK9VF5tEZCfPXUYbK48GMU6o19PrdwNtkoOWaBw0R1H7bl3n8zZC7buxLkZC32H5HaRBpK1Dpyo7tZBnmeZC0DyhY2xW953LQZAQMl8ujqimuhDyPzgsUZAIB6u5EQ2WZBisO504CDUtGcZAvtm7jAvQjpGCtAZDZD';

FB.setAccessToken(access_token);

var albumName = 'albumTest-' + Math.floor((Math.random() * 10) + 1);
var albumDescription = 'descriptionTest';

//Privacy options: EVERYONE, ALL_FRIENDS, NETWORKS_FRIENDS, FRIENDS_OF_FRIENDS, CUSTOM 
var privacy = 'EVERYONE';

FB.api(
    "/me/albums",
    "post",
    {
        "name": albumName,
        "message": albumDescription,
        "privacy": {'value': privacy}
    },
    function (response) {
      if(!response || response.error) {
    console.log(!response ? 'error: No album created' : response.error);
    return;
      }
    }
);
