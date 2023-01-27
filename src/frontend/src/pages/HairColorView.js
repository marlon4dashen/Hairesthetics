
import React, { useEffect, useRef, useState } from "react"
import io from "socket.io-client"
import "../css/HairStyleView.css"

const socket = io.connect('http://localhost:5001/test')
function HairColorView() {

	const [ stream, setStream ] = useState()
    const inputRef = useRef(null);
    const canvasRef = useRef(null);
    const outputRef = useRef(null);

    const videoRef = useRef(null);  
    const photoRef = useRef(null);
    const stripRef = useRef(null);
    const colorRef = useRef(null);

    var constraints = {
        video: {
        width: { min: 640 },
        height: { min: 480 }
        }
    };
	useEffect(() => {
        socket.on('connect', function() {
            console.log('Connected!');
        });
        getVideo();
        // navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
		// 	setStream(stream)
        //     inputRef.current.srcObject = stream

        //     setInterval(function () {
        //         sendSnapshot();
        //     }, 30);
        // }).catch(function(error) {
        //     console.log(error);
        // });

	}, [videoRef])

    const stopVideo = (e) => {
        // const stream = videoRef.current.srcObject;
        // const tracks = stream.getTracks();

        // for (let i = 0; i < tracks.length; i++) {
        //     let track = tracks[i];
        //     track.stop();
        // }

        // videoRef.current.srcObject = null;
    }

    const getVideo = () => {
        navigator.mediaDevices
        .getUserMedia(constraints)
        .then(stream => {
            setStream(stream)
            let video = videoRef.current;
            video.srcObject = stream;
            var playPromise = video.play();
            if (playPromise !== undefined) {
                playPromise.then(_ => {
                })
                .catch(error => {
                // Auto-play was prevented
                // Show paused UI.
                });
            }
        })
      .catch(err => {
        console.error("error:", err);
      });
  };

  const paintToCanvas = () => {
    let video = videoRef.current;
    let photo = photoRef.current;
    let ctx = photo.getContext("2d");

    const width = 320;
    const height = 240;
    photo.width = width;
    photo.height = height;

    return setInterval(() => {

        ctx.drawImage(video, 0, 0, width, height);
    //   let pixels = ctx.getImageData(0, 0, width, height);
        let dataURL = photo.toDataURL('image/jpeg');
        socket.emit('input image', dataURL);
        var img = new Image();
        socket.on('out-image-event',function(data){
            img.src = dataURL//data.image_data
            if (outputRef){
                outputRef.current.setAttribute('src', data.image_data);
            }
            
            // ctx.drawImage(data.image_data, 0, 0, width, height);
        });
    }, 30);
  };

  const takePhoto = () => {
    let photo = photoRef.current;
    let strip = stripRef.current;

    const data = photo.toDataURL("image/jpeg");

    console.warn(data);
    const link = document.createElement("a");
    link.href = data;
    link.setAttribute("download", "myWebcam");
    link.innerHTML = `<img src='${data}' alt='thumbnail'/>`;
    strip.insertBefore(link, strip.firstChild);
  };

  return (
      <div className="webcam-video">
        <button onClick={() => takePhoto()}>Take a photo</button>
        <video
          onCanPlay={() => paintToCanvas()}
          ref={videoRef}
          className="player"
        />
        <canvas ref={photoRef} className="photo" />
        <div className="photo-booth">
            <img ref={outputRef}></img>
         
        </div>
      </div>
  );
}

export default HairColorView;