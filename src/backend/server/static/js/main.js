// When the DOM is fully loaded
$(document).ready(function(){
  // Define the socket namespace
  let namespace = "/test";

  // Get the video, canvas, and context elements
  let video = document.querySelector("#videoElement");
  let canvas = document.querySelector("#canvasElement");
  let ctx = canvas.getContext('2d');
  photo = document.getElementById('photo');
  var localMediaStream = null;

  // Connect to the socket server with the specified namespace
  var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port + namespace);

  // Function to send a snapshot of the video stream to the server
  function sendSnapshot() {
    // If there is no local media stream, do nothing
    if (!localMediaStream) {
      return;
    }

    ctx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight, 0, 0, 300, 150);

    let dataURL = canvas.toDataURL('image/jpeg');
    socket.emit('input image', dataURL);

    socket.emit('output image')

    var img = new Image();
    socket.on('out-image-event',function(data){


    img.src = dataURL//data.image_data
    photo.setAttribute('src', data.image_data);

    });


  }

  socket.on('connect', function() {
    console.log('Connected!');
  });

  var constraints = {
    video: {
      width: { min: 640 },
      height: { min: 480 }
    }
  };

  navigator.mediaDevices.getUserMedia(constraints).then(function(stream) {
    video.srcObject = stream;
    localMediaStream = stream;
    fps = 10;
    setInterval(function () {
      sendSnapshot();
    }, 1000/fps);
  }).catch(function(error) {
    console.log(error);
  });
});

