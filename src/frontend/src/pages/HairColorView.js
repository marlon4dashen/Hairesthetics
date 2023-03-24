
import React, { useEffect, useRef, useState } from "react"
import io from "socket.io-client"
import axios from "axios";
import { Container } from 'react-bootstrap'
import {BsPlayCircle, BsStopCircle, BsUpload} from 'react-icons/bs'
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Tabs, { tabsClasses } from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Alert from '@mui/material/Alert';
import Collapse from '@mui/material/Collapse';
import {Typography, Box} from '@mui/material';
import PropTypes from 'prop-types';
// import Cookies from "js-cookie";

import "../css/HairColorView.css"

function TabPanel(props) {
    const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

const host = "ec2-18-191-171-138.us-east-2.compute.amazonaws.com"
const socket = io.connect(`https://${host}/test`)
const makeid = (length) => {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
}

function HairColorView() {
    const photoRef = useRef(null);
    const videoRef = useRef(null);
    const outputVideoRef = useRef(null);
    const [ hairColor, setHairColor ] = useState({r: "244",g: "67",b: "54",a: "1",})
    const { r, g, b, a } = hairColor;
    const [isShowVideo, setIsShowVideo] = useState(false);
    const [isShowImage, setIsShowImage] = useState(false);
    const [localMediaStream, setLocalMediaStream] = useState(null);
    const [currentInterval, setCurrentInterval] = useState(null);
    const [uploadedFile, setUploadFile] = useState(null);
    const [uploadedFileURL, setUploadFileURL] = useState(null);
    const [downloadedFile, setDownloadedFile] = useState(null);
    const [openAlert, setAlertOpen] = useState({visible: false, message: ""});
    const hiddenFileInput = useRef(null);
    const mediaWidth = 300;
    const mediaHeight = 300;
    const [userid, setUserID] = useState(makeid(5));
    const constraints = {
        video: {
            width: 300,
            height: 300,
            audio: false,
        }
    };

    const colorList = [
        { key: 0, label: "Smoky Black", hex:"#100C07", rgb: {r: "16", g: "12", b: "7"} },
        { key: 1, label: "Liver", hex:"#5A3825", rgb: {r: "90", g: "56", b: "37"} },
        { key: 2, label: "Brown Yellow", hex:"#CC9966", rgb: {r: "204", g: "153", b: "102"} },
        { key: 3, label: "Indigo", hex:"#580271", rgb: {r: "88", g: "2", b: "113"} },
        { key: 4, label: "Deep Magenta", hex:"#DB02C2", rgb: {r: "219", g: "2", b: "194"} },
        { key: 5, label: "Flirt", hex:"#970572", rgb: {r: "151", g: "5", b: "114"} },
        { key: 6, label: "Fuzzy Wuzzy", hex:"#F78DA7", rgb: {r: "247", g: "141", b: "167"} },
        { key: 7, label: "Crayola's Maize", hex:"#FFCC47", rgb: {r: "255", g: "204", b: "71"} },
        { key: 8, label: "Crayola's Gold", hex:"#E6BE8A", rgb: {r: "230", g: "190", b: "138"} },
        { key: 9, label: "Golden Brown", hex:"#996515", rgb: {r: "153", g: "101", b: "21"} },
        { key: 10, label: "Falu Red", hex:"#801818", rgb: {r: "128", g: "24", b: "24"} },
        { key: 11, label: "Beer", hex:"#FF9321", rgb: {r: "255", g: "147", b: "33"} },
        { key: 12, label: "Metallic Orange", hex:"#DA680F", rgb: {r: "218", g: "104", b: "15"} },
        { key: 13, label: "Blue", hex:"#1273DE", rgb: {r: "18", g: "115", b: "222"} },
        { key: 14, label: "Navy Blue", hex:"#8ED1FC", rgb: {r: "142", g: "209", b: "252"} },
        { key: 15, label: "Green", hex:"#4CAF50", rgb: {r: "76", g: "175", b: "80"} },
        { key: 16, label: "Light Green", hex:"#00D084", rgb: {r: "0", g: "208", b: "132"} },
        { key: 17, label: "Dark Charcoal", hex:"#333333", rgb: {r: "51", g: "51", b: "51"} },
        { key: 18, label: "White", hex:"#FFFFFF", rgb: {r: "255", g: "255", b: "255"} },
        { key: 19, label: "Philippine Silver", hex:"#B8B8B8", rgb: {r: "184", g: "184", b: "184"} },
    ];

    const [tab, setTab] = React.useState(0);
    const handleChange = (event, newValue) => {
        setTab(newValue);
    };

    const [colorTab, setColorTab] = React.useState(0);
    const handleColorTabChange = (event, newValue) => {
        setColorTab(newValue);
    };

    const startCam = () => {
        clearUploadedFile();
        socket.on('connect', function() {
            console.log('Connected!');
        });
        navigator.mediaDevices.getUserMedia(constraints).then(function(stream) {
            setIsShowVideo(true);
            setAlertOpen({visible: false, message: ""})
            videoRef.current.srcObject = stream;
            setLocalMediaStream(stream)
            let fps = 5;
            if (currentInterval){
                clearInterval(currentInterval);
                setCurrentInterval(null);
            }
            setCurrentInterval(setInterval(paintToCanvas, 1000/fps));
        }).catch(function(error) {
            setAlertOpen({visible: true, message: "Permission Error - webcam is disabled"})
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
            axios.get(`https://${host}/clear?userid=${userid}`)
            // setUserID(null);
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
        socket.emit('input image', { userid: userid, image: dataURL, r:hairColor.r, g:hairColor.g, b:hairColor.b });
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
        setAlertOpen({visible: false, message: ""})
        const formData = new FormData();
        formData.append('imgFile', file);
        axios.post(`https://${host}/image`, formData, {params: {r: r, g: g, b: b}})
        .then(res => {
            if (res.status === 200) {
                let imageBytes = res.data;
                setDownloadedFile(imageBytes);
            } else {
                setAlertOpen({visible: true, message: "Server Error - Please try again later"})
            }
        })
        .catch(error => {console.log(error); setAlertOpen({visible: true, message: "Server Error - Please try again later"})});
    }

    const onColorChange = (color) => {
        setHairColor(color.rgb);
        if (isShowImage && uploadedFile){
            setIsShowVideo(false);
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

    useEffect(() => {
        if(userid) {
            // Cookies.set(userid)
            socket.emit('add_user', { userid: userid })
            console.log(userid)
            // outputVideoRef.current.src=`https://localhost:5001/video_feed?userid=${userid}`
        } 
        return () => {
            setUserID(null);
            axios.get(`https://${host}/remove?userid=${userid}`)
        }
    }, [userid])

    useEffect(()=>{
        return () => URL.revokeObjectURL(uploadedFile)
    }, [uploadedFile])

    return (
    <>
        <Container fluid className="page-container">
            <Container>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs centered value={tab} onChange={handleChange} aria-label="basic tabs example"
                      TabIndicatorProps={{
                        style: {backgroundColor: "white",}
                    }}>
                    <Tab label="❏ Image" className="tab-label"/>
                    <Tab label="❏ Live Action" className="tab-label"/>
                </Tabs>
                </Box>
                <TabPanel value={tab} index={0} className="option-tab">
                    <p className="my-2">Upload an image with people in it and check how their hair color changes</p>
                    <input type="file" accept="image/*" ref={hiddenFileInput} onChange={handleFileChange} onClick={(event)=>{event.target.value = null}} style={{display:'none'}} />
                    <Button variant="contained" className='mx-1 my-1 start-button' onClick={handleClick} startIcon={<BsUpload />}> Upload an Image</Button>
                </TabPanel>
                <TabPanel value={tab} index={1} className="option-tab">
                    <p className="my-2">See your hair color changes in real time</p>
                    <Button variant="contained"  className='mx-1 my-1 start-button' onClick={startCam} startIcon={<BsPlayCircle />}>Start Video Feed</Button>
                    <Button variant="outlined" className='mx-1 my-1 stop-button' onClick={stopCam} startIcon={<BsStopCircle />}>Stop Video Feed</Button>
                </TabPanel>
            </Container>
            <Collapse in={openAlert.visible} className="alert-container">
                <Alert
                    severity="error"
                    sx={{ mt: 1 }}
                >
                    <strong>{openAlert.message}</strong>
                </Alert>
            </Collapse>
            <Container fluid className="video-container">
                <Grid container spacing={2} justifyContent="center">
                    <Grid item xs={9} md={4} className="input-col" justifyContent="center">
                        {isShowVideo &&(<video className="webcam-video" autoPlay={true} ref={videoRef}></video>)}
                        {isShowVideo &&(<canvas ref={photoRef} />)}
                        {isShowImage && <img style={{'width': mediaWidth, 'height': mediaHeight}} src={uploadedFileURL} />}
                    </Grid>
                    <Grid item xs={9} md={4} className="output-col" justifyContent="center">
                        {/* {isShowVideo && <img src={"https://localhost:5001/video_feed?userid=" + userid}  alt="transformed_output"></img>} */}
                        {isShowVideo && <img src={`https://${host}/video_feed?userid=${userid}`}  alt="transformed_output"></img>}
                        {/* {isShowVideo && <img alt="transformed_output" ref={outputVideoRef}></img>} */}
                        {isShowImage && <img style={{'width': mediaWidth, 'height': mediaHeight}} 
                        src={`data:image/jpeg;base64,${downloadedFile}`} />}
                    </Grid>
                </Grid>
            </Container>
            <Container className="color-picker">
                <Tabs
                    value={colorTab}
                    onChange={handleColorTabChange}
                    variant="scrollable"
                    scrollButtons
                    allowScrollButtonsMobile
                    aria-label="scrollable force tabs example"
                    TabIndicatorProps={{
                        style: {
                            backgroundColor: "#FFFFFF"
                        }
                    }}
                    sx={{
                        [`& .${tabsClasses.scrollButtons}`]: {
                            '&.Mui-disabled': { opacity: 0.3 },
                        },
                    }}
                >
                    {colorList.map((data) => (
                        <Tab style={{ backgroundColor:data.hex }}
                            className="color-tab"
                            key={data.key}
                            onClick={() => onColorChange(data)}
                    />
                    ))}
                </Tabs>
            </Container>
        </Container>
    </>
  );
}

export default HairColorView;