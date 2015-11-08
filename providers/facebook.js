const FB = require('fb')
const mkdirp = require('mkdirp')
const fs = require('fs')
const request = require('request')
const Promise = require('promise')
const https = require('https'); // Https module of Node.js
const FormData = require('form-data'); // Pretty multipart form maker.
const log = require('../lib/console-tweak.js')

const access_token = fs.readFileSync('./facebook.token', 'utf8')
FB.setAccessToken(access_token)

mkdirp('temp/', function (err) {})

function pullPhoto () {
  return new Promise(function (resolve, reject) {
    FB.api(
      '/me',
      'get',
      {'fields': 'albums{name,count,photos.limit(999999){images}}'},
      function (response) {
        var lastAlbum = response.albums.data[0]
        var lastAlbumName = response.albums.data[0].name
        var thisAlbumLength = response.albums.data[0].count
        var latestPhotoIndex = thisAlbumLength - 1
        var lastPhotoUploadedUrl = response.albums.data[0].photos.data[latestPhotoIndex].images[0].source
        console.log('The album ' + lastAlbumName + ' is the latest album created.')

        var download = function (uri, filename, callback) {
          request.head(uri, function (err, res, body) {
            if (typeof res === 'undefined') {
              reject('Download headers request failed.')
            }

            // For debug purposes        
            if (res.headers['content-type'] != 'image/jpeg') {
              console.log('content-type:', res.headers['content-type'])
              console.log('content-length:', res.headers['content-length'])
            }

            request(uri).pipe(fs.createWriteStream(filename)).on('close', callback)
          })
        }

        download(lastPhotoUploadedUrl , 'temp/Latest_Photo.jpg', function () {
          resolve('./temp/Latest_Photo.jpg')
          console.log('The last photo from the album ' + lastAlbumName + ' has been downloaded.')
        })
      }
    )
  })
}

function pushPhoto (path) {
  return new Promise(function (resolve, reject) {
    // Create multipart form
    var form = new FormData()

    // Put file
    form.append('file', fs.createReadStream(path))
    form.append('message', 'Me gusta') // Put message

    // POST request options, notice 'path' has access_token parameter
    var options = {
      method: 'post',
      host: 'graph.facebook.com',
      path: '/138719479819169/photos?access_token=' + access_token,
      headers: form.getHeaders(),
    }

    // Do POST request, callback for response
    var request = https.request(options, function (res) {
      resolve('ok')
      console.log(res)
    })

    // Binds form to request
    form.pipe(request)

    // If anything goes wrong (request-wise not FB)
    request.on('error', function (error) {
      reject('ko')
      console.log(error)
    })
  })
}

function downloadAlbumPhotos () {
  FB.api('/me', 'get', {'fields': 'albums{photos{images}}'}, function (res) {
    if (!res || res.error) {
      console.log(!res ? 'error occurred' : res.error)
      return
    }

    var albumIndex
    var albumsPhotoList = []
    var numberOfAlbuns = res.albums.data.length
    for (albumIndex = 0; albumIndex < numberOfAlbuns; albumIndex++) {
      var numberOfPhotosPerAlbum = res.albums.data[albumIndex].photos.data.length
      console.log('Album ' + albumIndex + ' has ' + numberOfPhotosPerAlbum + ' photos.')
      albumsPhotoList[albumIndex] = res.albums.data[albumIndex].photos
    }

    var fs = require('fs'),
      request = require('request')

    var download = function (uri, filename, callback) {
      request.head(uri, function (err, res, body) {
        // For debug purposes
        if (res.headers['content-type'] != 'image/jpeg') {
          console.log('content-type:', res.headers['content-type'])
          console.log('content-length:', res.headers['content-length'])
        }
        request(uri).pipe(fs.createWriteStream(filename)).on('close', callback)
      })
    }

    var currentPhotoIndex
    var photoCount = 0
    var albumCount = 0
    var currentAlbum = []
    var albumPhotoIndex
    for (albumPhotoIndex = 0; albumPhotoIndex < albumsPhotoList.length; albumPhotoIndex++) {
      console.log('Extracting photos of album ' + albumPhotoIndex + '.')
      currentAlbum = albumsPhotoList[albumPhotoIndex].data
      for (currentPhotoIndex = 0; currentPhotoIndex < currentAlbum.length; currentPhotoIndex++) {
        console.log('Photo ' + currentPhotoIndex + ' of album ' + albumPhotoIndex + ' is being downloaded.')
        var currentPhotoURL = currentAlbum[currentPhotoIndex].images[0].source
        if (albumCount != albumsPhotoList.length - 1) {
          download(currentPhotoURL , 'temp/Album_' + albumPhotoIndex + '-Photo ' + currentPhotoIndex + '.jpg', function () {
            console.log('Photo ' + currentPhotoIndex + ' from album ' + albumCount + ' downloaded.')
          })
          photoCount++
        } else {
          download(currentPhotoURL , 'temp/Profile_photo ' + currentPhotoIndex + '.jpg', function () {
            console.log('Profile photo ' + currentPhotoIndex + ' downloaded.')
          })
          photoCount++
        }
      }
      if (photoCount = currentAlbum.length) {
        console.log('Done: All photos from album ' + albumPhotoIndex + ' have been downloaded.')
        albumCount++
        photoCount = 0
      }
    }
  })
}

function createAlbum () {
  var albumName = 'albumTest-' + Math.floor((Math.random() * 10) + 1)
  var albumDescription = 'descriptionTest'

  // Privacy options: EVERYONE, ALL_FRIENDS, NETWORKS_FRIENDS, FRIENDS_OF_FRIENDS, CUSTOM 
  var privacy = 'EVERYONE'

  FB.api(
    '/me/albums',
    'post',
    {
      'name': albumName,
      'message': albumDescription,
      'privacy': {'value': privacy}
    },
    function (response) {
      if (!response || response.error) {
        console.log(!response ? 'error: No album created' : response.error)
        return
      }
    }
  )
}

module.exports = {
  pushPhoto: pushPhoto,
  pullPhoto: pullPhoto,
  downloadAlbumPhotos: downloadAlbumPhotos,
  createAlbum: createAlbum
}
