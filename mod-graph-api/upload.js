var FB = require('fb');
var access_token = 'CAACEdEose0cBAA692aeNLfIyTICEqf9DNXJyZBhgPrxxllJ7tUEWOufh2kZBVvZCrbIipPr0X2lOGCTMBy0Wz9vgtGLEx0fKnD76bBB6GC8wOWHavveQdgnlXA71M6ThZAw5AZBejoYbvnz8ZAuKEbsgXREZAvEMOoaSHRfNoXzaZBZCSTuAwmwO06IiVdZAqV8HeZAEhJ7cS4um2ZCKilKJY7ZCK';

FB.setAccessToken(access_token);



FB.api(
  '/me',
  'GET',
  {"fields":"id,name"},
  function(response) {
      var userID = res.id;
	  var userName = res.name;
  }
);
var body = 'My first post using facebook-node-sdk';
FB.api('me/photos', 'post', { message: body}, function (res) {
  if(!res || res.error) {
    console.log(!res ? 'error occurred' : res.error);
    return;
  }
  console.log('Post Id: ' + res.id);



var canvas = document.getElementById("uploadTest");
var imageData  = canvas.toDataURL("image/png");
try{
    blob = dataURItoBlob(imageData);
}catch(e){console.log(e);}
var fd = new FormData();
fd.append("source", blob);
fd.append("message","Photo Text");
try{
        blob = dataURItoBlob(imageData,mimeType);
}catch(e){console.log(e);}
try{
   $.ajax({
        url:"https://graph.facebook.com/" + <<userID received on getting user details>> + "/photos?access_token=" + access_token,
        type:"POST",
        data:fd,
        processData:false,
        contentType:false,
        cache:false,
        success:function(data){
            console.log("success " + data);
        },
        error:function(shr,status,data){
            console.log("error " + data + " Status " + shr.status);
        },
        complete:function(){
            console.log("Ajax Complete");
        }
    });

}catch(e){console.log(e);

function dataURItoBlob(dataURI,mime) {
    // convert base64 to raw binary data held in a string
    // doesn't handle URLEncoded DataURIs

    var byteString = window.atob(dataURI);

    // separate out the mime component


    // write the bytes of the string to an ArrayBuffer
    //var ab = new ArrayBuffer(byteString.length);
    var ia = new Uint8Array(byteString.length);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }

    // write the ArrayBuffer to a blob, and you're done
    var blob = new Blob([ia], { type: mime });

    return blob;
}
});