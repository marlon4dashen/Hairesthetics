import React, { useEffect, useState, useMemo } from "react"
import {Container, Button, Row, Col, Card, ListGroup} from 'react-bootstrap'
import {IoMdLocate} from 'react-icons/io';
import axios from 'axios';
import '../css/SalonRecommendation.css';
import { GoogleMap, useLoadScript, Marker, InfoWindow } from "@react-google-maps/api";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import AsyncSelect from 'react-select/async'
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import { Triangle } from  'react-loader-spinner'

import blackDot from "../assets/icons/black-marker.png";
import seat from "../assets/icons/seat.png"
const { GOOGLE_MAPS_API_KEY } = require("../config.json");
import bgImg from "../assets/banner/b1.jpg"

function SalonRecommendationView() {
    const { isLoaded } = useLoadScript({
        googleMapsApiKey: GOOGLE_MAPS_API_KEY,
        libraries: ["places"],
    });
    const [resultsLength, setResultLength] = useState(0)
    const [searchResults, setSearchResults] = useState([])
    const [selected, setSelected] = useState(null);
    const [complete, setComplete] = useState(false);
    const [loading, setLoading] = useState(false);

    function Map() {
        const center = useMemo(() => ({ lat: 43.6532, lng: -79.3832 }), []);
        const [selectedPlace, setSelectedPlace] = useState(null)
        useEffect(() => {
            const listener = e => {if (e.key === "Escape") {setSelectedPlace(null);}};
            window.addEventListener("keydown", listener);
            return () => { window.removeEventListener("keydown", listener);};
        }, []);
        return (
            <>
            <GoogleMap zoom={15} center={(selected) ? selected : center} mapContainerClassName="map-container">
                {selected && <Marker position={selected} icon={blackDot}/>}
                {searchResults.length > 0 && 
                    searchResults.map((salon)=>(
                        <Marker 
                            key={salon.place_id} 
                            position={{lat: salon.lat, lng:salon.lng}}
                            icon={seat}
                            className="salon-marker"
                            onClick={() => {
                                setSelectedPlace(salon);
                            }}
                        />
                ))}
                {selectedPlace && (
                    <InfoWindow
                        // info window open at clicked location
                        position={{lat: selectedPlace.lat, lng: selectedPlace.lng}}
                        onCloseClick={() => {
                            setSelectedPlace(null);
                        }}
                        className="info-window"
                    >
                        {/* Display location information */}
                        <div>
                            <h4 style={{fontWeight: 'bold'}}>{selectedPlace.name}</h4>
                            <p>{selectedPlace.address}</p>
                        </div>
                    </InfoWindow>
                )}
            </GoogleMap>
            </>
        );
    }

    const PlacesAutocomplete = ({ setSelected }) => {
        const {
            ready,
            value,
            suggestions: { status, data },
            setValue,
            clearSuggestions,
        } = usePlacesAutocomplete({
            requestOptions: {/* Define search scope here */},
            debounce: 300,
        });

        const handleSelect = async (inputText) => {
            let address = inputText.label;
            setValue(address, false);
            clearSuggestions();
            const results = await getGeocode({ address });
            const { lat, lng } = await getLatLng(results[0]);
            setSelected({lat: lat, lng: lng });
            setLoading(true)
            searchNearbySalon(lat, lng);
        };

        const loadOptions = async (inputText, callback) => {
            setValue(inputText);
            if (status === "OK") {
                callback(data.map(({ place_id, description }) => ({label: description, value: place_id})))
            }
        }

        return (
            <>
                <Row className="pt-2 pb-3">
                    <Col>
                        <AsyncSelect isSearchable={true} 
                            placeholder="🔍 Search an address"
                            loadOptions={loadOptions}
                            onChange={handleSelect}
                            isDisabled={!ready}
                            theme={(theme) => ({
                                ...theme,
                                borderRadius: 0,
                                colors: {
                                    ...theme.colors,
                                    primary25: 'lightgrey',
                                    primary: 'black',
                            },})}
                            styles={{option: (base) => ({
                                ...base,
                                border: `1px solid white`,
                                height: '100%',
                            }),}}
                        />
                    </Col>
                    <Col xs="auto" md="auto">
                        <Button variant="outline-light" onClick={locateUserLocation}><IoMdLocate /> Use current location</Button>
                    </Col>
                </Row>
            </>
        );
    };

    const locateUserLocation = () => {
        setLoading(true)
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
            function(position) {
                let lat = position.coords.latitude;
                let lng = position.coords.longitude
                setSelected({lat: lat, lng: lng})
                searchNearbySalon(lat, lng);
            },
            function(error) {
                setLoading(false)
                console.error("Error Code = " + error.code + " - " + error.message);
            }
        );
        }else {
            setLoading(false)
            alert("Geolocation is not supported")
        }
    }

    const searchNearbySalon = (inputLat, inputLng) => {
        setComplete(false)
        // setLoading(true)
        axios.get(`http://localhost:5001/salons?lat=${inputLat}&lng=${inputLng}`)
        .then(response => {
            const data = response.data
            var responseCode = data.code
            if (responseCode === 'error'){
                alert("server error");
                
            } else{
                setResultLength(data.length)
                setSearchResults(data.salons)
                // console.log(data.salons)
            }
            setComplete(true)
            setLoading(false)
            })
        .catch(error => alert(error))
    }

    return (
        <div className="page-container" style={{backgroundImage: `url(${bgImg})`}}>
            <Container>
                <PlacesAutocomplete setSelected={setSelected} />
            </Container>
            
            <Container className='pb-4'>
                <Row>
                    <Col>{isLoaded && <Map />}</Col>
                </Row>
                {complete ? (
                <Row>
                    <Col className="results-col">
                        <Divider className="results-col-header"   
                            sx={{
                                "&::before, &::after": {
                                borderColor: "#4DB6AC",
                            }}}>
                            {resultsLength} results found
                        </Divider>
                        {( resultsLength >0 ) ? (
                            <Grid container className='card-list-container' spacing={3} justifyContent="center" alignItems="center">
                                {searchResults.map((salon) => (
                                    <Grid item xs={9} md={4} key={salon.place_id}>
                                        <Card border='light' className="salon-card">
                                        <Card.Header className="card-header">{salon.name}</Card.Header>
                                        <Card.Body>
                                             <ListGroup className="list-group-flush">
                                                 <ListGroup.Item>{salon.address}</ListGroup.Item>
                                                 <ListGroup.Item>
                                                    Ratings: {salon.rating} | 
                                                    Total Reviews: {salon.user_ratings_total}
                                                    {(salon.website) && (<>{' '}|{' '} <a className="salon-link" href={salon.website} target="_blank" rel="noreferrer">Website</a></>)}
                                                </ListGroup.Item>
                                             </ListGroup>
                                         </Card.Body>
                                        </Card>      
                                    </Grid>                                  
                                ))}
                            </Grid>           
                        ): <></>}
                    </Col>
                </Row>) :
                (loading && 
                    <Triangle
                        wrapperClass="loading-container"
                        height="25%"
                        width="25%"
                        color="#FDFEFE"
                        ariaLabel="triangle-loading"
                        visible={!complete}
                    />                
                )}
            </Container>
        </div>
    );
}

export default SalonRecommendationView;