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
import blackDot from "../assets/icons/black-marker.png";
import seat from "../assets/icons/seat.png"

const { GOOGLE_MAPS_API_KEY } = require("../config.json");
function SalonRecommendationView() {
    const { isLoaded } = useLoadScript({
        googleMapsApiKey: GOOGLE_MAPS_API_KEY,
        libraries: ["places"],
    });
    const [resultsLength, setResultLength] = useState(0)
    const [searchResults, setSearchResults] = useState([])
    const [selected, setSelected] = useState(null);

    function Map() {
        const center = useMemo(() => ({ lat: 43.6532, lng: -79.3832 }), []);
        
        const [selectedPlace, setSelectedPlace] = useState(null)
        useEffect(() => {
            const listener = e => {
                if (e.key === "Escape") {setSelectedPlace(null);}
            };
            window.addEventListener("keydown", listener);
            return () => { window.removeEventListener("keydown", listener);};
        }, []);
        return (
            <>
            <GoogleMap
                zoom={12}
                center={(selected) ? selected : center}
                mapContainerClassName="map-container"
            >
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
                >
                    {/* Display location information */}
                    <div className="infoWindow" style={{fontWeight: 'bold', color: 'blue'}}>
                        <h4>{selectedPlace.name}</h4>
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
            requestOptions: {
            /* Define search scope here */
            },
            debounce: 300,
        });

        const handleSelect = async (inputText) => {
            let address = inputText.label;
            setValue(address, false);
            clearSuggestions();
            const results = await getGeocode({ address });
            const { lat, lng } = await getLatLng(results[0]);
            setSelected({lat: lat, lng: lng });
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
                                border: `1px solid black`,
                                height: '100%',
                            }),}}
                        />
                    </Col>
                    <Col xs="auto" md="auto">
                        <Button variant="dark" onClick={locateUserLocation}><IoMdLocate /> Use current location</Button>
                    </Col>
                </Row>
            </>
        );
    };

    const locateUserLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
            function(position) {
                let lat = position.coords.latitude;
                let lng = position.coords.longitude
                setSelected({lat: lat, lng: lng})
                searchNearbySalon(lat, lng);
            },
            function(error) {
                console.error("Error Code = " + error.code + " - " + error.message);
            }
        );
        }else {
            alert("Geolocation is not supported")
        }
    }

    const searchNearbySalon = (inputLat, inputLng) => {
        axios.get(`http://localhost:5001/salons?lat=${inputLat}&lng=${inputLng}`)
        .then(response => {
            const data = response.data
            var responseCode = data.code
            if (responseCode === 'error'){
                alert("server error");
            } else{
                setResultLength(data.length)
                setSearchResults(data.salons)
                console.log(data.salons)
            }})
        .catch(error => alert(error))
    }

    return (
        <Container className="page-container">
            <Container>
                <PlacesAutocomplete setSelected={setSelected} />
            </Container>

            <Container className='pb-4'>
                <Row>
                    <Col sm={8}>{isLoaded && <Map />}</Col>
                    <Col sm={4} className="results-col">
                        {/* <p>{resultsLength} results found</p> */}
                        <Divider className=""   
                            sx={{
                                "&::before, &::after": {
                                borderColor: "rgba(var(--bs-dark-rgb),1)",
                            }}}>
                            {resultsLength} results found
                        </Divider>
                        {( resultsLength >0 ) ? (
                            <ListGroup className="card-list-container">
                                {searchResults.map((salon) => (
                                    <ListGroup.Item
                                        as="li"
                                        className="d-flex align-items-start"
                                        key={salon.place_id}
                                    >
                                        <Card border='dark' className="salon-card">
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
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>           
                        ): <></>}
                    </Col>
                </Row>
            </Container>
        </Container>
    );
}

export default SalonRecommendationView;