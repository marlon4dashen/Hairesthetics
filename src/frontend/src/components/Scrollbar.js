//this file sets the scrollbar for the web application
import React, { useEffect, useState } from "react";
import {Card, CardContent, CardMedia, CardActionArea, Button, Typography, Grid, Paper, IconButton, Chip, Box, Tabs} from '@mui/material';
import { makeStyles } from '@mui/styles';
import styled from "@emotion/styled";
import hair0 from "../../public/assets/hairstyles/hair0.png"
import hair1 from "../../public/assets/hairstyles/hair1.png"
import hair2 from "../../public/assets/hairstyles/hair2.png"

//constant used to set the scrollbar
const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    justifyContent: "center",
    flexWrap: "nowrap",
    listStyle: "none",
    margin: 0,
    overflow: "auto",
    maxWidth: "100%",
  },
  card: {
    height: "20vh",
    width: "15vh",
  }
}));

export function Scrollbar(selectedHair, setSelectedHair, ...props) {
  const classes = useStyles();

  const [hairList, setHairList] = useState([
    { key: 0, label: "Short", img:"/_/public/assets/hairstyles/hair0.png" },
    { key: 1, label: "Braids", img:"/_/public/assets/hairstyles/hair1.png"  },
    { key: 2, label: "Medium", img:"/_/public/assets/hairstyles/hair1.png" },
    { key: 3, label: "Long", img:"/_/public/assets/hairstyles/hair2.png" },
    // { key: 3, label: "Ponytail" },
    // { key: 4, label: "Braids" },
    // { key: 5, label: "Short" },
    // { key: 6, label: "Medium" },
    // { key: 7, label: "Long" },
    // { key: 8, label: "Ponytai" },
    // { key: 9, label: "Braids" }
  ]);
  console.log(hairList)

  return (
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
            label={data.label}
            selected={data.key === selectedHair}
            key={data.key}
            onClick={() => setSelectedHair(data.key)}
        >
            <CardActionArea>
              <CardMedia
                className="rect-img"
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
  );
}


