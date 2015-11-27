module.exports = (function () {
  const Canvas = require('canvas');
  const Image = Canvas.Image;
  const fs = require('fs');

  return {
  	getImageDataFromFile: function (filePath) {
      var data = fs.readFileSync(filePath);
      var img = new Image();
      img.src = data;

      var ctx, cvs;
      cvs = new Canvas(200, 200);
      cvs.width = img.width;
      cvs.height = img.height;
      ctx = cvs.getContext("2d");
      ctx.drawImage(img, 0, 0);
      this.resizeImage(cvs);
      return ctx.getImageData(0, 0, cvs.width, cvs.height);
    },

    resizeImage: function (canvas) {
      var ctx, maxHeight, maxWidth, ratio, tempCanvas, tempCtx;
      maxWidth = 960;
      maxHeight = 720;
      ratio = 1;
      ctx = canvas.getContext("2d");
      if (canvas.width > maxWidth) {
        ratio = maxWidth / canvas.width;
      }
      if (canvas.height > maxHeight) {
        if (maxHeight / canvas.height < ratio) {
          ratio = maxHeight / canvas.height;
        }
      }
      tempCanvas = new Canvas(200, 200);
      tempCtx = tempCanvas.getContext("2d");
      tempCanvas.width = canvas.width;
      tempCanvas.height = canvas.height;
      tempCtx.drawImage(canvas, 0, 0);
      canvas.width = canvas.width * ratio;
      canvas.width = 16 * Math.floor(canvas.width / 16);
      canvas.height = canvas.height * ratio;
      canvas.height = 16 * Math.floor(canvas.height / 16);
      return ctx.drawImage(tempCanvas, 0, 0, tempCanvas.width, tempCanvas.height, 0, 0, canvas.width, canvas.height);
    }
  }
})()
