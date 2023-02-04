
import React, { useEffect, useState } from "react";
import {Card, CardContent, CardMedia, CardActionArea, Button, Typography, Grid, Paper, IconButton, Chip, Box, Tabs} from '@mui/material';
import { makeStyles } from '@mui/styles';
import styled from "@emotion/styled";
import hair0 from "../../public/assets/hairstyles/hair0.png"
import hair1 from "../../public/assets/hairstyles/hair1.png"
import hair2 from "../../public/assets/hairstyles/hair2.png"
import hair3 from "../../public/assets/hairstyles/hair3.png"
import CssBaseline from "@mui/material/CssBaseline";

import "../css/HairStyleView.css"

import ARCanvas from '../components/ARCanvas';

import {createTheme} from '@mui/material';
import {ThemeProvider} from '@mui/styles';



const theme = createTheme({
  palette: {
    background: {
      default: "#33374111;"
    },
    text: {
      primary: "#ffffff"
    },
  },
  menu: {
    "& .MuiPaper-root": {
      backgroundColor: "lightblue"
    }
  },
  typography: {
      h1: {
        fontWeight: 'bold',
      },
      h2: {
        fontWeight: 'bold',
      },
      h3: {
        fontWeight: 'bold',
      },
  },
  buttonIcon: {
    color: "#ffffff",
},
});

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    justifyContent: "center",
    alignItems:"center",
    listStyle: "none",
    margin: 0,
    overflow: "auto",
    maxWidth: "100%",
    position:"fixed",
    top:"76vh",
    zIndex:"10",

  },
  blank:{
    height: "16vh",
    width: "100vw",

  },
  card: {
    height: "16vh",
    width: "17vh",
  },
  img:{
    "object-fit": "cover",
    width: "17vh",
    height: "12.5vh"
  }
}));



function HairStyleView() {
  const [selectedHair, setSelectedHair] = useState(0);
  const classes = useStyles();

  const [hairList, setHairList] = useState([
    { key: 0, label: "Short", img:"/_/public/assets/hairstyles/hair0.png" },
    { key: 1, label: "Braids", img:"/_/public/assets/hairstyles/hair1.png"  },
    { key: 2, label: "Medium", img:"/_/public/assets/hairstyles/hair2.png" },
    { key: 3, label: "Long", img:"/_/public/assets/hairstyles/hair3.png" },
    { key: 4, label: "Short", img:"/_/public/assets/hairstyles/hair0.png" },
    { key: 5, label: "Braids", img:"/_/public/assets/hairstyles/hair1.png"  },
    { key: 6, label: "Medium", img:"/_/public/assets/hairstyles/hair2.png" },
    { key: 7, label: "Long", img:"/_/public/assets/hairstyles/hair3.png" }
    // { key: 3, label: "Ponytail" },
    // { key: 4, label: "Braids" },
    // { key: 5, label: "Short" },
    // { key: 6, label: "Medium" },
    // { key: 7, label: "Long" },
    // { key: 8, label: "Ponytail" },
    // { key: 9, label: "Braids" }
  ]);
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <ARCanvas/>
        <Box className={classes.root} >
        <Tabs
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
          TabIndicatorProps={{
            style: {
              backgroundColor: "#444444"
            }
          }}
          aria-label="scrollable auto tabs"
          value={selectedHair}
        >
          {hairList.map((data) => (
          <Card
              className={classes.card}
              label={data.label}
              selected={data.key === selectedHair}
              key={data.key}
              onClick={() => setSelectedHair(data.key)}

          >
              <CardActionArea>
                <CardMedia
                  className={classes.img}
                  component="img"
                  image={data.img}
                  alt='hair-img'
                />
                  <Typography gutterBottom variant="h6" component="div">
                    {data.label}
                  </Typography>
              </CardActionArea>
            </Card>

          ))}
        </Tabs>
        </Box>

      </ThemeProvider>
    )
}
export default HairStyleView;