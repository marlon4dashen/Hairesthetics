
import React, { useEffect, useRef, useState } from "react"
import io from "socket.io-client"
import Webcam from "react-webcam";
import * as cam from "@mediapipe/camera_utils";
import "../css/HairStyleView.css"

const socket = io.connect('http://localhost:5001/test')
function HairColorView() {
    const webcamRef = useRef(null);
    const outputRef = useRef(null); 
    const photoRef = useRef(null);

	useEffect(() => {
        socket.on('connect', function() {
            console.log('Connected!');
        });
        let camera;
        if (
            typeof webcamRef.current !== "undefined" &&
            webcamRef.current !== null
        ) {
            camera = new cam.Camera(webcamRef.current.video, {
                onFrame: () => {
                    paintToCanvas(webcamRef.current.video);
                },
                width: 640,
                height: 480,
                
            });
            camera.start();
        }
        return () => {
            // console.log('leaving!');
            camera.stop();
            camera = null;
        }   
	}, [])

  const paintToCanvas = (video) => {
    if (!video){
        return;
    }
    let photo = photoRef.current;
    let ctx = photo.getContext("2d");

    const width = 320;
    const height = 240;
    photo.width = width;
    photo.height = height;
    ctx.drawImage(video, 0, 0, width, height);
    let dataURL = photo.toDataURL('image/jpeg');
    socket.emit('input image', dataURL);
    socket.on('out-image-event',function(data){
        if (outputRef.current){
            outputRef.current.setAttribute('src', data.image_data);
            // outputRef.current.setAttribute('alt', 'outputref');
        }
    });
  };

  return (
      <div className="webcam-video">
        <Webcam
          ref={webcamRef}
          className="inputVideo"
          hidden
        />{" "}
        <canvas ref={photoRef} className="photo" />
        <div className="photo-booth">
            <img ref={outputRef} alt="transformed_output"></img>
         
        </div>
      </div>
  );
}

export default HairColorView;