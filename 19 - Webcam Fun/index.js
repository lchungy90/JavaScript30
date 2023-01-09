window.onload = function() {
  canvas = document.querySelector('canvas');
  video = document.querySelector('video');
  ctx = canvas.getContext('2d');
  img = document.querySelector('#myimg');
  slider = document.querySelector('.rgb');
  a = document.querySelector('a');
  
  filter = {
      rmin: 0,
      rmax: 255,
      gmin: 0,
      gmax: 255,
      bmin: 0,
      bmax: 255
  }

  
  askWebcam();

  slider.onchange = function(e) {
      ctx.putImageData(origindata, 0, 0);
      const target = e.target;
      const startPos = {
          'r': 0,
          'g': 1,
          'b': 2
      }[target.name[0]];
      var tempFilter = checkFilter(target.name, target.value);
      const filterMin = tempFilter.min;
      const filterMax = tempFilter.max;
      var img = ctx.getImageData(0, 0, 300, 200);


      var imgd = img.data;
      for (var i = startPos, len = imgd.length; i < len; i += 4) {
          if (imgd[i] < filterMin) {
              imgd[i] = filterMin;
          } else if (imgd[i] > filterMax) {
              imgd[i] = filterMax;
          }
      }
      ctx.putImageData(img, 0, 0);
      img.src = canvas.toDataURL();
  }

}


function takePhoto() {
  ctx.drawImage(video, 0, 0, 300, 200);
  origindata = ctx.getImageData(0, 0, 300, 200);
}

function savePhoto() {
  img.src = canvas.toDataURL();
  a.href = canvas.toDataURL();
  a.setAttribute('download', 'handsome');
}


function askWebcam() {
  navigator.getUserMedia = navigator.getUserMedia ||
      navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia;
  if (navigator.getUserMedia) {
      navigator.getUserMedia({
          audio: false,
          video: {
              width: 300,
              height: 200
          }
      }, function(stream) {
          video.srcObject = stream;
          video.onloadedmetadata = function(e) {
              video.play();
          }
      }, function(err) {
          console.log('Error occured:' + err.name);
      });
  } else {
      console.log('this navigator doesn\'t support webcam!');
  }
}


function checkFilter(name, value) {
  var _min;
  var _max;
  var _antiname = {
      'rmin': 'rmax',
      'rmax': 'rmin',
      'gmin': 'gmax',
      'gmax': 'gmin',
      'bmin': 'bmax',
      'bmax': 'bmin'
  }[name]
  filter[name] = value;
  //当下限值超过上限时，将两者对调
  _min = Math.min(filter[name], filter[_antiname]);
  _max = Math.max(filter[name], filter[_antiname]);
  console.log(filter);
  return {
      min: _min,
      max: _max
  }
}