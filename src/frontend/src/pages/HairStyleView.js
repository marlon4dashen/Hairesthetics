
import React, { useState } from "react";
import {Card, CardContent, CardMedia, CardActionArea, Button, Typography, Grid, Paper, IconButton, Chip, Box} from '@mui/material';
import Tabs, { tabsClasses } from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { makeStyles } from '@mui/styles';
import { Container } from 'react-bootstrap'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import styled from "@emotion/styled";
import hair0 from "../../public/assets/hairstyles/hair0.png"
import hair1 from "../../public/assets/hairstyles/hair1.png"
import hair2 from "../../public/assets/hairstyles/hair2.png"
import hair3 from "../../public/assets/hairstyles/hair3.png"
import hair4 from "../../public/assets/hairstyles/hair4.png"
import hair5 from "../../public/assets/hairstyles/hair5.png"
import hair6 from "../../public/assets/hairstyles/hair6.png"
import hair7 from "../../public/assets/hairstyles/hair7.png"
import CssBaseline from "@mui/material/CssBaseline";

import ARCanvas from '../components/ARCanvas';
import {createTheme} from '@mui/material';
import {ThemeProvider} from '@mui/styles';
import "../css/HairStyleView.css"




const themeDark = createTheme({
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
    zIndex:3,


  },
  blank:{
    height: "70vh",
    width: "100vw",

  },
  card: {
    borderRadius: 0,
    boxShadow: 'none',
    minHeight: "14vh",
    minWidth: "14vh",
  },
  img:{
    borderRadius: 0,
    "object-fit": "cover",
    width: "14vh",
    height: "11vh"
  }
}));



function HairStyleView() {
  const classes = useStyles();
  const [selectedHair, setSelectedHair] = useState(-1);
  const [selectedColor, setSelectedColor] = useState("");


  const [colorTab, setColorTab] = useState(0);
    const handleColorTabChange = (event, newValue) => {
        setColorTab(newValue);
    };

  const [hairList, setHairList] = useState([
    { key: 0, label: "Bob", img:"/_/public/assets/hairstyles/hair0.png" },
    { key: 1, label: "Reverse", img:"/_/public/assets/hairstyles/hair1.png" },
    { key: 2, label: "Marilyn M.", img:"/_/public/assets/hairstyles/hair2.png"  },
    { key: 3, label: "Mid-split", img:"/_/public/assets/hairstyles/hair3.png" },
    { key: 4, label: "Quiff", img:"/_/public/assets/hairstyles/hair4.png" },
    { key: 5, label: "Slicked-back", img:"/_/public/assets/hairstyles/hair5.png" },
    { key: 6, label: "Afro", img:"/_/public/assets/hairstyles/hair6.png" },
    { key: 7, label: "Undercut", img:"/_/public/assets/hairstyles/hair7.png" },

  ]);

  const colorList = [
    { key: 0, label: "Original", hex:"#FFFFFF", rgb: {r: "255", g: "255", b: "255"} },
    { key: 1, label: "Smoky Black", hex:"#100C07", rgb: {r: "16", g: "12", b: "7"} },
    { key: 2, label: "Liver", hex:"#5A3825", rgb: {r: "90", g: "56", b: "37"} },
    { key: 3, label: "Brown Yellow", hex:"#CC9966", rgb: {r: "204", g: "153", b: "102"} },
    { key: 4, label: "Indigo", hex:"#580271", rgb: {r: "88", g: "2", b: "113"} },
    { key: 5, label: "Deep Magenta", hex:"#DB02C2", rgb: {r: "219", g: "2", b: "194"} },
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
    { key: 18, label: "Flirt", hex:"#970572", rgb: {r: "151", g: "5", b: "114"} },
    { key: 19, label: "Philippine Silver", hex:"#B8B8B8", rgb: {r: "184", g: "184", b: "184"} },
];

    return (
      <ThemeProvider theme={themeDark}>

        <Container fluid className="hairstyle-page">
        <CssBaseline />


        <ARCanvas
          selectedHair={selectedHair}
          color={selectedColor}
        />
        <div className={classes.blank}/>
        <Box className={classes.root} >
        {selectedHair == -1 &&
        <Tabs
          variant="scrollable"
          scrollButtons
          allowScrollButtonsMobile
          TabIndicatorProps={{
            style: {
              backgroundColor: "#FFFFFF"
            }
          }}
          aria-label="scrollable auto tabs"
          value={selectedHair}
          sx={{
            [`& .${tabsClasses.scrollButtons}`]: {
                '&.Mui-disabled': { opacity: 0.3 },
            },
        }}
        >
          {hairList.map((data) => (
          <Card
              className={classes.card}
              style={{ borderRadius: 0, boxShadow: "none", backgroundColor:"#000000" }}
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
                  <Typography gutterBottom variant="h6" component="div" color="common.white">
                    {data.label}
                  </Typography>
              </CardActionArea>
            </Card>

          ))}
        </Tabs>
        }
        {selectedHair != -1 &&
          <>
          <Grid container spacing={0}>
            <Grid item xs={1}>
              <IconButton onClick={() => setSelectedHair(-1)}>
                <ChevronLeftIcon style={{ color: 'white', fontSize: 40 }} />
              </IconButton>
            </Grid>
            <Grid item xs={11} >
            <Container>
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
                            onClick={() => setSelectedColor(data.hex)}
                    />
                    ))}
                </Tabs>
            </Container>
            </Grid>
          </Grid>

        </>

        }

        </Box>
        </Container>
      </ThemeProvider>
    )
}
export default HairStyleView;