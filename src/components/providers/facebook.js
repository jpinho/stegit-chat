'use strict'

const path = require('path');
const FB = require('fb')
const mkdirp = require('mkdirp')
const fs = require('fs')
const request = require('request')
const Promise = require('promise')
const https = require('https');
const FormData = require('form-data');
const log = require('../helpers/console-tweak.js')

const TEMP_PATH = path.join('.', '../../../temp')
const access_token = fs.readFileSync(__dirname + '/../../config/facebook.token', 'utf8')
FB.setAccessToken(access_token)
mkdirp(TEMP_PATH, null)

function pullPhoto () {
  let graphQuery = 'albums{name,count,photos.limit(999999){images}}'

  return new Promise(function (resolve, reject) {
    FB.api('/me', 'get', {'fields': graphQuery}, function (response) {
      let lastAlbum, lastAlbumName, thisAlbumLength, latestPhotoIndex, lastPhotoUploadedUrl;
      try  {
        lastAlbum = response.albums.data[0]
        lastAlbumName = response.albums.data[0].name
        thisAlbumLength = response.albums.data[0].count
        latestPhotoIndex = thisAlbumLength - 1
        lastPhotoUploadedUrl = response.albums.data[0].photos.data[latestPhotoIndex].images[0].source
        console.log('pullPhoto: latest album created is "', lastAlbumName, '"')
      }
      catch (ex) {
        reject(ex)
        return
      }
      let targetPath = path.join(TEMP_PATH, 'Latest_Photo.jpg')
      downloadPhoto(lastPhotoUploadedUrl , targetPath, function () {
        resolve(targetPath)
        return
      })
    })
  })
}

function downloadPhoto (uri, filename, callback){
  request.head(uri, function (err, res, body) {
    if (typeof res === 'undefined') {
      reject('downloadPhoto: headers request failed.')
    }
    if (res.headers['content-type'] != 'image/jpeg') {
      console.log('downloadPhoto: headers content type is not image/jpeg:')
      console.log('- content-type:', res.headers['content-type'])
      console.log('- content-length:', res.headers['content-length'])
    }
    request(uri).pipe(fs.createWriteStream(filename)).on('close', callback)
  })
}

function pushPhoto (path) {
  return new Promise(function (resolve, reject) {
    let form = new FormData()
    form.append('file', fs.createReadStream(path))
    form.append('message', 'timestamp: ' + Date.parse(new Date()))

    let options = {
      method: 'post',
      host: 'graph.facebook.com',
      path: '/139958753028575/photos?access_token=' + access_token,
      headers: form.getHeaders(),
    }

    let request = https.request(options, function (res) {
      resolve()
      console.log('pushPhoto: resolve w/ response:', res)
    })

    form.pipe(request)
    request.on('error', function (error) {
      reject()
      console.log('pushPhoto: reject w/ error:', error)
    })
  })
}

function downloadAlbumPhotos () {
  FB.api('/me', 'get', {'fields': 'albums{photos{images}}'}, function (res) {
    if (!res || res.error) {
      console.log(!res ? 'error occurred' : res.error)
      return
    }

    let albumIndex
    let albumsPhotoList = []
    let numberOfAlbuns = res.albums.data.length
    for (albumIndex = 0; albumIndex < numberOfAlbuns; albumIndex++) {
      let numberOfPhotosPerAlbum = res.albums.data[albumIndex].photos.data.length
      console.log('Album ' + albumIndex + ' has ' + numberOfPhotosPerAlbum + ' photos.')
      albumsPhotoList[albumIndex] = res.albums.data[albumIndex].photos
    }

    let fs = require('fs'),
      request = require('request')

    let download = function (uri, filename, callback) {
      request.head(uri, function (err, res, body) {
        // For debug purposes
        if (res.headers['content-type'] != 'image/jpeg') {
          console.log('content-type:', res.headers['content-type'])
          console.log('content-length:', res.headers['content-length'])
        }
        request(uri).pipe(fs.createWriteStream(filename)).on('close', callback)
      })
    }

    let currentPhotoIndex
    let photoCount = 0
    let albumCount = 0
    let currentAlbum = []
    let albumPhotoIndex
    for (albumPhotoIndex = 0; albumPhotoIndex < albumsPhotoList.length; albumPhotoIndex++) {
      console.log('Extracting photos of album ' + albumPhotoIndex + '.')
      currentAlbum = albumsPhotoList[albumPhotoIndex].data
      for (currentPhotoIndex = 0; currentPhotoIndex < currentAlbum.length; currentPhotoIndex++) {
        console.log('Photo ' + currentPhotoIndex + ' of album ' + albumPhotoIndex + ' is being downloaded.')
        let currentPhotoURL = currentAlbum[currentPhotoIndex].images[0].source
        if (albumCount != albumsPhotoList.length - 1) {
          download(currentPhotoURL , path.join(TEMP_PATH, 'Album_' + albumPhotoIndex + '-Photo ' + currentPhotoIndex + '.jpg'), function () {
            console.log('Photo ' + currentPhotoIndex + ' from album ' + albumCount + ' downloaded.')
          })
          photoCount++
        } else {
          download(currentPhotoURL , path.join(TEMP_PATH, 'Profile_photo ' + currentPhotoIndex + '.jpg'), function () {
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
  const albumName = 'albumTest-' + Math.floor((Math.random() * 10) + 1)
  const albumDescription = 'descriptionTest'
  const privacy = 'EVERYONE'

  FB.api('/me/albums', 'post',
    {'name': albumName, 'message': albumDescription, 'privacy': {'value': privacy}},
    function (response) {
      if (!response || response.error) {
        console.log(!response ? 'error: No album created' : response.error)
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
