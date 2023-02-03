import React from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';

// Images
import bgImage from "../assets/hair.jpg";
import hairStyle from "../assets/hair_style.jpg";
import hairColor from "../assets/color_change.jpeg";
import map from "../assets/map.png";

function HomeView() {
    
    return (
        <>
            <Grid container sx={{ marginTop: '5%' }}>
                <Grid item xs={2}></Grid>
                <Grid item xs={8}>
                    <Typography variant='h3' color='#212529' sx={{ fontWeight: 'bold' }}>Hairesthetics</Typography>
                </Grid>
                <Grid item xs={2}></Grid>

                <Grid item xs={2}></Grid>
                <Grid item xs={8}>
                    <Typography variant='h6' color='#4f5d75' >Get your modern hair aesthetics anywhere at anytime.</Typography>
                </Grid>
                <Grid item xs={2}></Grid>
            </Grid>

            <Grid container sx={{ marginTop: '5%' }}>
                <Grid item xs={1}></Grid>
                    <Grid item xs={10}>
                        <img src={bgImage} width='80%' height='95%'/>
                    </Grid>
                <Grid item xs={1}></Grid>
            </Grid>

            <Grid container sx={{ marginTop: '10%' }}>
                <Grid item xs={2}></Grid>
                <Grid item xs={8}>
                    <Typography variant='h4' color='#212529' sx={{ fontWeight: 'bold' }}>Your personal hair stylist</Typography>
                </Grid>
                <Grid item xs={2}></Grid>
                
                <Grid item xs={2}></Grid>
                <Grid item xs={8}>
                    <Typography variant='h6' color='#4f5d75' >
                        Try your new hair style/color with our frontier AI&AR technology.
                    </Typography>
                </Grid>
                <Grid item xs={2}></Grid>

                <Grid item xs={2}></Grid>
                <Grid item xs={8}>
                    <Typography variant='h6' color='#4f5d75' >
                        Search for nearby barber stores and GO!
                    </Typography>
                </Grid>
                <Grid item xs={2}></Grid>
            </Grid>

            <Grid container sx={{ marginTop: '6%' }}>
                <Grid item xs={1}></Grid>
                <Grid item xs={5}>
                    <Grid container sx={{marginTop: '30%' }}>
                        <Grid item xs={1}></Grid>
                        <Grid item xs={9}>
                            <div>
                                <Typography variant='h4' color='#212529' sx={{ fontWeight: 'bold' }}>Modern Hair Styles</Typography>
                            </div>
                            <div>
                                <Typography variant='h6' color='#4f5d75' >Get your new hair style by playing with our frontier AR technology.</Typography>
                            </div>
                            <div>
                            <Link href="/style" variant='h6'>Get Started→</Link>
                            </div>
                        </Grid>
                        <Grid item xs={2}></Grid>
                    </Grid>
                </Grid>
                <Grid item xs={5}>
                    <img src={hairStyle} width='80%' height='95%'/>
                </Grid>
                <Grid item xs={1}></Grid>
            </Grid>

            <Grid container sx={{ marginTop: '6%' }}>
                <Grid item xs={1}></Grid>
                <Grid item xs={5}>
                    <img src={hairColor} width='100%' height='100%'/>
                </Grid>
                <Grid item xs={5}>
                    <Grid container sx={{marginTop: '22%' }}>
                        <Grid item xs={1}></Grid>
                        <Grid item xs={9}>
                            <div>
                                <Typography variant='h4' color='#212529' sx={{ fontWeight: 'bold' }}>
                                    Realtime Hair Color Segmentation
                                </Typography>
                            </div>
                            <div>
                                <Typography variant='h6' color='#4f5d75' >
                                Using advanced deep learning techniques we can dynamically changing hair color in live video.
                                </Typography>
                            </div>
                            <div>
                            <Link href="/color" variant='h6'>Get Started→</Link>
                            </div>
                        </Grid>
                        <Grid item xs={2}></Grid>
                    </Grid>
                </Grid>
                <Grid item xs={1}></Grid>
            </Grid>

            <Grid container sx={{ marginTop: '6%', marginBottom: '5%' }}>
                <Grid item xs={1}></Grid>
                <Grid item xs={5}>
                    <Grid container sx={{marginTop: '20%' }}>
                        <Grid item xs={1}></Grid>
                        <Grid item xs={9}>
                            <div>
                                <Typography variant='h4' color='#212529' sx={{ fontWeight: 'bold' }}>Find Nearby Barbers</Typography>
                            </div>
                            <div>
                                <Typography variant='h6' color='#4f5d75' >
                                    Integrating with Google Map API, we recommand the top rated barber stores around you.
                                </Typography>
                            </div>
                            <div>
                            <Link href="/salon" variant='h6'>Get Started→</Link>
                            </div>
                        </Grid>
                        <Grid item xs={2}></Grid>
                    </Grid>
                </Grid>
                <Grid item xs={5}>
                    <img src={map} width='100%' height='100%'/>
                </Grid>
                <Grid item xs={1}></Grid>
            </Grid>
        </>
    );
}

export default HomeView;