import React from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import {Link as CreditLink}  from '@mui/material';
import Button from 'react-bootstrap/Button';
import Figure from 'react-bootstrap/Figure';
import {Link} from 'react-router-dom';

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
                        <Figure>
                            <Figure.Image
                                width="95%"
                                height="95%"
                                alt="Elina Sazonova"
                                src={bgImage}
                            />
                            <Figure.Caption>
                                Credit: Elina Sazonova (<CreditLink href="https://www.pexels.com/photo/woman-wearing-black-top-2072584/">Pexels</CreditLink>)
                            </Figure.Caption>
                        </Figure>
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
                                <Button variant="dark" as={Link} to='/style'>Get Started →</Button>
                            </div>
                        </Grid>
                        <Grid item xs={2}></Grid>
                    </Grid>
                </Grid>
                <Grid item xs={5}>
                    <Figure>
                        <Figure.Image
                            width="80%"
                            height="95%"
                            alt="Ali Pazani"
                            src={hairStyle}
                        />
                        <Figure.Caption>
                            Credit: Ali Pazani (<CreditLink href="https://www.pexels.com/photo/woman-in-grey-long-sleeved-shirt-2787341/">Pexels</CreditLink>)
                        </Figure.Caption>
                    </Figure>
                </Grid>
                <Grid item xs={1}></Grid>
            </Grid>

            <Grid container sx={{ marginTop: '6%' }}>
                <Grid item xs={1}></Grid>
                <Grid item xs={5}>
                    <Figure>
                        <Figure.Image
                            width="100%"
                            height="100%"
                            alt="171x180"
                            src={hairColor}
                        />
                        <Figure.Caption>
                            Credit: Hair Segmentation (<CreditLink href="https://www.banuba.com/blog/hair-segmentation-virtual-hair-color-try-on">Banuba</CreditLink>)
                        </Figure.Caption>
                    </Figure>
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
                                Using advanced deep learning techniques we can dynamically changing hair color in live video and images.
                                </Typography>
                            </div>
                            <div>
                                <Button variant="dark" as={Link} to='/color'>Get Started →</Button>
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
                                <Typography variant='h4' color='#212529' sx={{ fontWeight: 'bold' }}>Find Nearby Salons</Typography>
                            </div>
                            <div>
                                <Typography variant='h6' color='#4f5d75' >
                                    Integrating with Google Maps and Places API, we recommand the top rated salons around you.
                                </Typography>
                            </div>
                            <div>
                                <Button variant="dark" as={Link} to='/salon'>Get Started →</Button>
                            </div>
                        </Grid>
                        <Grid item xs={2}></Grid>
                    </Grid>
                </Grid>
                <Grid item xs={5}>
                    <Figure>
                        <Figure.Image
                            width="100%"
                            height="100%"
                            alt="171x180"
                            src={map}
                        />
                        {/* <Figure.Caption>
                            Credit: Elina Sazonova (<CreditLink href="#">Pexels</CreditLink>)
                        </Figure.Caption> */}
                    </Figure>
                </Grid>
                <Grid item xs={1}></Grid>
            </Grid>
        </>
    );
}

export default HomeView;