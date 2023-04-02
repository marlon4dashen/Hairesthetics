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

    // Draw the current video frame onto the canvas
    ctx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight, 0, 0, 300, 150);

    // Convert the canvas image to a data URL in JPEG format
    let dataURL = canvas.toDataURL('image/jpeg');
    
    // Emit the input image data to the server
    socket.emit('input image', dataURL);

    // Request the output image from the server
    socket.emit('output image')

    var img = new Image();

    // Listen for the 'out-image-event' and update the image source
    socket.on('out-image-event',function(data){


    img.src = dataURL//data.image_data
    photo.setAttribute('src', data.image_data);

    });


  }

  // On socket connection
  socket.on('connect', function() {
    console.log('Connected!');
  });

  // Set video constraints
  var constraints = {
    video: {
      width: { min: 640 },
      height: { min: 480 }
    }
  };

  // Get the user's media (video stream) with the specified constraints
  navigator.mediaDevices.getUserMedia(constraints).then(function(stream) {
    // Set the video source to the user's media stream
    video.srcObject = stream;
    localMediaStream = stream;

    // Set the desired frames per second (fps)
    fps = 10;

    // Send a snapshot to the server at the specified interval
    setInterval(function () {
      sendSnapshot();
    }, 1000/fps);
  }).catch(function(error) {
    // Log any errors encountered when getting the user's media
    console.log(error);
  });
});

