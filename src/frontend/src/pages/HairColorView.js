
import React, { useEffect, useRef, useState } from "react"
import io from "socket.io-client"
import axios from "axios";
import { CirclePicker, MaterialPicker } from 'react-color';
import { Container, Row, Col } from 'react-bootstrap'
import {BsPlayCircle, BsStopCircle, BsUpload} from 'react-icons/bs'
import Divider from '@mui/material/Divider';
import { styled } from '@mui/material/styles';
import MuiGrid from '@mui/material/Grid';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';

import "../css/HairColorView.css"

const Grid = styled(MuiGrid)(({ theme }) => ({
  width: '100%',
  ...theme.typography.body2,
  '& [role="separator"]': {
    margin: theme.spacing(0, 2),
  },
}));

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
    const [uploadedFileURL, setUploadFileURL] = useState(null);
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
        clearUploadedFile();
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
                setCurrentInterval(null);
            }
            setCurrentInterval(setInterval(paintToCanvas, 1000/fps));
        }).catch(function(error) {
            console.log(error);
        });
    }

    const stopCam = () => {
        if (localMediaStream){
            const tracks = localMediaStream.getTracks();
            tracks.forEach(track => track.stop());
            if (currentInterval){
                clearInterval(currentInterval);
                setCurrentInterval(null);
            }
            setIsShowVideo(false);
            axios.get("http://localhost:5001/clear")
        }
    }

    const paintToCanvas = () => {
        let video = videoRef.current;
        let photo = photoRef.current;
        let ctx = photo.getContext("2d");
        photo.width = mediaWidth;
        photo.height = mediaHeight;
        ctx.drawImage(video, 0, 0, mediaWidth, mediaHeight);
        let dataURL = photo.toDataURL('image/jpeg');
        // console.log(hairColor);
        socket.emit('input image', { image: dataURL, r:hairColor.r, g:hairColor.g, b:hairColor.b });
    };

    const handleClick = (event) => {
        hiddenFileInput.current.click();
        stopCam()
    };

    const handleFileChange = (event) => {
        setIsShowImage(true);
        const file = event.target.files[0];
        setUploadFile(file);
        setUploadFileURL(URL.createObjectURL(file));
        processImage(file);
    };

    const processImage = (file)  => {
        const formData = new FormData();
        formData.append('imgFile', file);
        axios.post("http://localhost:5001/image", formData, {params: {r: r, g: g, b: b}})
        .then(res => {
            console.log(res.data);
            if (res.status === 200) {
                let imageBytes = res.data;
                setDownloadedFile(imageBytes);
            }
        })
        .catch(error => console.log(error));
    }

    const onColorChange = (color) => {
        setHairColor(color.rgb);
        if (isShowImage && uploadedFile){
            processImage(uploadedFile)
        } else if (currentInterval){
            clearInterval(currentInterval);
            setCurrentInterval(setInterval(paintToCanvas, 1000/5));
        }
            
    }

    const clearUploadedFile = () => {
        setUploadFile(null);
        setDownloadedFile(null);
        setIsShowImage(false);
    }

    useEffect(()=>{
        return () => URL.revokeObjectURL(uploadedFile)
    }, [uploadedFile])

    return (    
    <>
        <Container fluid className="page-container">    
            <Container>
            <Grid container className="mt-3 mb-1">
                <Grid item xs>
                    <div>
                        <Divider className="option-title"   
                            sx={{
                                "&::before, &::after": {
                                borderColor: "rgba(var(--bs-dark-rgb),1)",
                            }}}>
                            LIVE ACTION
                        </Divider>
                        <p className="my-2">See your hair color changes in real time</p>
                        <Button variant="contained" style={{backgroundColor: "rgba(var(--bs-dark-rgb),1)"}} className='mx-1' onClick={startCam} startIcon={<BsPlayCircle />}>Start Video Feed</Button>
                        <Button variant="outlined" style={{borderColor: "rgba(var(--bs-dark-rgb),1)", color: "black"}} className='mx-1' onClick={stopCam} startIcon={<BsStopCircle />}>Stop Video Feed</Button>
                    </div>
                    
                </Grid>
                <Divider orientation="vertical" flexItem sx={{
                                "&::before, &::after": {
                                borderColor: "rgba(var(--bs-dark-rgb),var(--bs-bg-opacity))",
                            }}}>
                    <Chip label="OR" />
                </Divider>
                <Grid item xs>
                    <div>
                        <Divider className="option-title" sx={{
                                "&::before, &::after": {
                                borderColor: "rgba(var(--bs-dark-rgb),var(--bs-bg-opacity))",
                            }}}>
                            IMAGE
                        </Divider>
                        <p className="my-2">Upload an image with people in it and check how their hair color changes</p>
                        <input type="file" accept="image/*" ref={hiddenFileInput} onChange={handleFileChange} onClick={(event)=>{event.target.value = null}} style={{display:'none'}} /> 
                        <Button variant="contained" style={{backgroundColor: "rgba(var(--bs-dark-rgb),1)"}} className='mx-1' onClick={handleClick} startIcon={<BsUpload />}> Upload an Image</Button>
                    </div>
                </Grid>
                </Grid>
            </Container>
            <Container className=''>
                <Divider sx={{
                            "&::before, &::after": {
                                borderColor: "rgba(var(--bs-dark-rgb),var(--bs-bg-opacity))",
                            }}}>
                    <Chip variant="outlined" label="" sx={{border: "1px solid"}}/>
                </Divider>
            </Container>
            <Container fluid className="video-container">
                <Row>
                    <Col className="input-col">
                        {isShowVideo &&(<video className="webcam-video" autoPlay={true} ref={videoRef}></video>)}
                        {isShowVideo &&(<canvas ref={photoRef} />)}
                        {isShowImage && <img style={{'width': mediaWidth, 'height': mediaHeight}} src={uploadedFileURL} />}
                    </Col>
                    <Col className="output-col">
                        {isShowVideo && <img src="http://localhost:5001/video_feed"  alt="transformed_output"></img>}
                        {isShowImage && <img style={{'width': mediaWidth, 'height': mediaHeight}} 
                        src={`data:image/jpeg;base64,${downloadedFile}`} />}
                    </Col>
                </Row>
            </Container>
            <Container className='mt-3'>
                <Divider sx={{
                            "&::before, &::after": {
                                borderColor: "rgba(var(--bs-dark-rgb),var(--bs-bg-opacity))",
                            }}}>
                    <Chip variant="outlined" label="Choose a color" sx={{border: "1px solid"}}/>
                </Divider>
            </Container>

            <Container fluid className="picker-container">                
                <Row lg={12}>
                    <Col>
                        <CirclePicker
                            color = {hairColor}
                            onChangeComplete={onColorChange}
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