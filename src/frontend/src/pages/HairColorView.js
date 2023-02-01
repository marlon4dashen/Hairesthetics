
import React, { useEffect, useRef, useState } from "react"
import io from "socket.io-client"
import { CirclePicker, MaterialPicker } from 'react-color';
import { Container, Row, Col, Button, Form } from 'react-bootstrap'
import {BsPlayCircle, BsStopCircle, BsUpload} from 'react-icons/bs'
import Divider from '@mui/material/Divider';

import "../css/HairColorView.css"
import axios from "axios";

const socket = io.connect('http://localhost:5001/test')
function HairColorView() {
    const photoRef = useRef(null);
    const videoRef = useRef(null);
    const [ hairColor, setHairColor ] = useState({r: "244",g: "67",b: "54",a: "1",})
    const { r, g, b, a } = hairColor;
    const [isShowVideo, setIsShowVideo] = useState(false);
    const [localMediaStream, setLocalMediaStream] = useState(null);
    const [currentInterval, setCurrentInterval] = useState(null);
    const [uploadedFile, setUploadFile] = useState("Upload Boundary File");
    const constraints = {
        video: {
            width: 300,
            height: 300,
            audio: false,
        }
    };

    const startCam = () => {
        setIsShowVideo(true);
        socket.on('connect', function() {
            console.log('Connected!');
        });
        
        navigator.mediaDevices.getUserMedia(constraints).then(function(stream) {
            videoRef.current.srcObject = stream;
            setLocalMediaStream(stream)
            let fps = 5;
            if (currentInterval){
                clearInterval(currentInterval);
            }
            setCurrentInterval(setInterval(paintToCanvas, 1000/fps));
        }).catch(function(error) {
            console.log(error);
        });
    }

    const stopCam = () => {
        const tracks = localMediaStream.getTracks();
        tracks.forEach(track => track.stop());
        if (currentInterval){
            clearInterval(currentInterval);
        }
        setIsShowVideo(false);
        //clean up buffer
        axios.get("http://localhost:5001/clear")
    }

    const paintToCanvas = () => {
        let video = videoRef.current;
        let photo = photoRef.current;
        let ctx = photo.getContext("2d");

        const width = 300;
        const height = 300;
        photo.width = width;
        photo.height = height;
        ctx.drawImage(video, 0, 0, width, height);
        let dataURL = photo.toDataURL('image/jpeg');
        console.log(hairColor);
        socket.emit('input image', { image: dataURL, r:hairColor.r, g:hairColor.g, b:hairColor.b });
    };

    const handleFileChange = (event) =>{
        let file = event.target.files[0];
        console.log(file)
        setUploadFile(file);
    }

    return (    
    <>
        <Container fluid className="page-container">    
            <Container>
                <Button className='mx-1' onClick={startCam}><BsPlayCircle /> Start Video Feed</Button>
                <Button className='mx-1' onClick={stopCam}><BsStopCircle /> Stop Video Feed</Button>
                    {/* <input
                    ref={inputRef}
                    onChange={handleDisplayFileDetails}
                    className="d-none"
                    type="file"
                /> */}
                <Form.Group>
                    <Form.Control type="file" accept="image/*" onChange={handleFileChange} />
                </Form.Group>
                {/* <Button className='mx-1' ><BsUpload /> Upload an Image</Button> */}
            </Container>
            <Divider variant="middle" className="container-divider"/>
            <Container fluid className="video-container">
                <Row>
                    <Col>
                        {isShowVideo &&(<video className="webcam-video" autoPlay={true} ref={videoRef}></video>)}
                        {isShowVideo &&(<canvas ref={photoRef}/>)}
                    </Col>
                    <Col>
                        {isShowVideo && <img src="http://localhost:5001/video_feed"  alt="transformed_output"></img>}
                    </Col>
                </Row>
            </Container>
            <Divider variant="middle" className="container-divider"/>
            <Container fluid className="picker-container">
                <Row lg={12}>
                    <Col>
                        <CirclePicker
                            color = {hairColor}
                            onChangeComplete={(color) => {
                                // console.log(color);
                                setHairColor(color.rgb);
                                if (currentInterval){
                                    clearInterval(currentInterval);
                                    setCurrentInterval(setInterval(paintToCanvas, 1000/5));
                                }
                                    
                            }}
                            className="color-picker"
                        />
                    </Col>
                    <Col>
                        <MaterialPicker color = {hairColor} className="color-picker"/>
                    </Col>
                </Row>
            </Container>
        </Container>
    </>
  );
}

export default HairColorView;