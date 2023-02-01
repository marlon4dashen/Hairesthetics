
import React, { useEffect, useRef, useState } from "react"
import io from "socket.io-client"
import Webcam from "react-webcam";
import { CirclePicker, MaterialPicker } from 'react-color';
import * as cam from "@mediapipe/camera_utils";
import { Container, Row, Col } from 'react-bootstrap'

import "../css/HairColorView.css"

const socket = io.connect('http://localhost:5001/test')
function HairColorView() {
    const webcamRef = useRef(null);
    const outputRef = useRef(null); 
    const photoRef = useRef(null);
    const [ hairColor, setHairColor ] = useState({    r: "241",
    g: "112",
    b: "19",
    a: "1",})
    const { r, g, b, a } = hairColor;
    const [ videoFeed, showVideoFeed] = useState(false);
    // const { r, g, b, a } = hairColor;
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
            showVideoFeed(false);
        }   
	}, [])

  const paintToCanvas = (video) => {
    if (!video){
        return;
    }
    let photo = photoRef.current;
    let ctx = photo.getContext("2d");
    showVideoFeed(true);
    const width = 320;
    const height = 240;
    photo.width = width;
    photo.height = height;
    ctx.drawImage(video, 0, 0, width, height);
    let dataURL = photo.toDataURL('image/jpeg');
    socket.emit('input image', dataURL);
    // socket.on('out-image-event',function(data){
    //     if (outputRef.current){
    //         outputRef.current.setAttribute('src', data.image_data);
    //         // outputRef.current.setAttribute('alt', 'outputref');
    //     }
    // });
  };

  return (
    <>
    <Container fluid className="page-container">    
        <Container fluid className="video-container">
            <Webcam ref={webcamRef} hidden />
            <canvas ref={photoRef}  />
            {/* <img ref={outputRef} alt="transformed_output"></img> */}
            {videoFeed && <img src="http://localhost:5001/video_feed"  alt="transformed_output"></img>}
        </Container>
        <Container fluid className="picker-container">
            <Row lg={12}>
                <Col>
            <CirclePicker
                color = {hairColor}
                onChangeComplete={(color) => {
                    setHairColor(color.rgb);
                }}
                className="color-picker"
            />
            </Col>
            {/* <Col></Col> */}
            <Col>
            <MaterialPicker color = {hairColor} className="color-picker"/>
            </Col>
            </Row>
            {/* <Container>
            <MaterialPicker color = {hairColor} className="color_picker"/>
            </Container> */}
            {/* <h1>Chosen Color</h1>
            <h1>{`${r}, ${g}, ${b}, ${a}`}</h1> */}
        </Container>
    </Container>
    </>
  );
}

export default HairColorView;