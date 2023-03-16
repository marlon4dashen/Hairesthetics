import React from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import {Link} from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import CardGroup from 'react-bootstrap/CardGroup';
import Button from '@mui/material/Button';
import EastIcon from '@mui/icons-material/East';

// Images
import hairStyle from "../assets/hair_style.jpg";
import hairColor from "../assets/color_change.jpeg";
import map from "../assets/map.png";

import "../css/HomeView.css"
import bannerImg from "../assets/b1.jpg"

function HomeView() {

    return (
        <>
            <Grid container direction="column" className='banner-container' justifyContent="center" alignItems="center" style={{backgroundImage: `url(${bannerImg})`}}>
                <Typography variant='h3' color='#FDFEFE' sx={{ fontWeight: 'bold' }}>HairEsthetics</Typography>
                <Typography variant='h6' color='#FDFEFE'>Try your new hair style/color with our frontier AI & AR technology at anytime.</Typography>
            </Grid>
            
            <Grid container className='features-container' spacing={3} justifyContent="center" alignItems="center">
            {/* <CardGroup className='features-container'> */}
            <Grid item xs={9} md={4}>
                <Card className="feature-card">
                <Card.Img variant="top" src={hairStyle} className="feature-image"/>
                <Card.Body className='feature-body'>
                    <Card.Title>Modern Hair Styles</Card.Title>
                    <Card.Text>
                    Get your new hair style by playing with our frontier AR technology.
                    </Card.Text>
                    <Button className="feature-button" variant="outlined" component={Link} to="/style" endIcon={<EastIcon />}>Get Started</Button>
                </Card.Body>
                </Card>
            </Grid>
            <Grid item xs={9} md={4}>
                <Card className="feature-card">
                <Card.Img variant="top" src={hairColor} className="feature-image"/>
                <Card.Body className='feature-body'>
                    <Card.Title>Realtime Hair Color Segmentation</Card.Title>
                    <Card.Text>
                    Using advanced deep learning techniques we can dynamically change hair color in live video and images.
                    </Card.Text>
                    <Button className="feature-button" variant="outlined" component={Link} to="/color" endIcon={<EastIcon />}>Get Started</Button>
                </Card.Body>
                </Card>
            </Grid>
            <Grid item xs={9} md={4}>
                <Card className="feature-card">
                <Card.Img variant="top" src={map} className="feature-image"/>
                <Card.Body className='feature-body'>
                    <Card.Title>Get Nearby Salons</Card.Title>
                    <Card.Text>
                    Integrating with Google Maps and Places API, we recommand the top rated salons around you.
                    </Card.Text>
                    <Button className="feature-button" variant="outlined" component={Link} to="/salon" endIcon={<EastIcon />}>Get Started</Button>
                </Card.Body>
                </Card>
            </Grid>
            {/* </CardGroup> */}
            </Grid>
        </>
    );
}

export default HomeView;