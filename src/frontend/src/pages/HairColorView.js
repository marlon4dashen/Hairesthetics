
import React, { useEffect, useRef, useState } from "react"
import io from "socket.io-client"
import { CirclePicker, MaterialPicker } from 'react-color';
import { Container, Row, Col, Button, Form } from 'react-bootstrap'
import {BsNutFill, BsPlayCircle, BsStopCircle, BsUpload} from 'react-icons/bs'
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
    const [isShowImage, setIsShowImage] = useState(false);
    const [localMediaStream, setLocalMediaStream] = useState(null);
    const [currentInterval, setCurrentInterval] = useState(null);
    const [uploadedFile, setUploadFile] = useState(null);
    const [downloadedFile, setDownloadedFile] = useState(null);
    const hiddenFileInput = useRef(null);

    const mediaWidth = 300;
    const mediaHeight = 300;
    const constraints = {
        video: {
            width: 300,
            height: 300,
            audio: false,
        }
    };

    const startCam = () => {
        setIsShowVideo(true);
        setIsShowImage(false);
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
        axios.get("http://localhost:5001/clear")
    }

    const paintToCanvas = () => {
        let video = videoRef.current;
        let photo = photoRef.current;
        let ctx = photo.getContext("2d");
        photo.width = mediaWidth;
        photo.height = mediaHeight;
        ctx.drawImage(video, 0, 0, mediaWidth, mediaHeight);
        let dataURL = photo.toDataURL('image/jpeg');
        console.log(hairColor);
        socket.emit('input image', { image: dataURL, r:hairColor.r, g:hairColor.g, b:hairColor.b });
    };

    const handleClick = (event) => {
        hiddenFileInput.current.click();
    };

    const handleFileChange = (event) => {
        setIsShowVideo(false);
        setIsShowImage(true);
        const file = event.target.files[0];
        setUploadFile(URL.createObjectURL(file));
        const formData = new FormData();
        formData.append('imgFile', file);
        axios.post("http://localhost:5001/image", formData, {params: {r: r, g: g, b: b}})
        .then(res => {
            console.log(res.data);
            if (res.status === 200) {
                let imageBytes = res.data;
                setDownloadedFile(imageBytes);
            }
            // check if user is successfully submitted
            // if (res.data.message === "successful submission"){
            //     alert("Review Submitted")
            //     this.resetUserInfo()
            // }else {
            //     alert("Some errors occured. Try again later")
            // }
        })
        .catch(error => console.log(error));
    };

    useEffect(()=>{
        return () => URL.revokeObjectURL(uploadedFile)
    }, [uploadedFile])

    return (    
    <>
        <Container fluid className="page-container">    
            <Container>
                <Button className='mx-1' onClick={startCam}><BsPlayCircle /> Start Video Feed</Button>
                <Button className='mx-1' onClick={stopCam}><BsStopCircle /> Stop Video Feed</Button>
                <input type="file" accept="image/*" ref={hiddenFileInput} onChange={handleFileChange} style={{display:'none'}} /> 
                <Button className='mx-1' onClick={handleClick}><BsUpload /> Upload an Image</Button>
            </Container>
            <Divider variant="middle" className="container-divider"/>
            <Container fluid className="video-container">
                <Row>
                    <Col>
                        {isShowVideo &&(<video className="webcam-video" autoPlay={true} ref={videoRef}></video>)}
                        {isShowVideo &&(<canvas ref={photoRef}/>)}
                        {isShowImage && <img style={{'width': mediaWidth, 'height': mediaHeight}} src={uploadedFile} />}
                    </Col>
                    <Col>
                        {isShowVideo && <img src="http://localhost:5001/video_feed"  alt="transformed_output"></img>}
                        {isShowImage && <img style={{'width': mediaWidth, 'height': mediaHeight}} 
                        src={`data:image/jpeg;base64,${downloadedFile}`} />}
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