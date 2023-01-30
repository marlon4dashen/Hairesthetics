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
import {
  Combobox,
  ComboboxInput,
  ComboboxPopover,
  ComboboxList,
  ComboboxOption,
} from "@reach/combobox";
import "@reach/combobox/styles.css";

const { GOOGLE_MAPS_API_KEY } = require("../config.json");
function SalonRecommendationView() {
    const { isLoaded } = useLoadScript({
        googleMapsApiKey: GOOGLE_MAPS_API_KEY,
        libraries: ["places"],
    });
    
    const [resultsLength, setResultLength] = useState(0)
    const [searchResults, setSearchResults] = useState([])
    const [inputAddress, setAddress] = useState("")
    const [selected, setSelected] = useState(null);

    function Map() {
        const center = useMemo(() => ({ lat: 43.6532, lng: -79.3832 }), []);
        
        const [selectedPlace, setSelectedPlace] = useState(null)
        useEffect(() => {
            const listener = e => {
            if (e.key === "Escape") {
                setSelectedPlace(null);
            }
            };
            window.addEventListener("keydown", listener);

            return () => {
                window.removeEventListener("keydown", listener);
            };
        }, []);
        return (
            <>
            <GoogleMap
                zoom={10}
                center={(selected) ? selected : center}
                mapContainerClassName="map-container"
            >
                {/* {selected && <Marker position={selected} />} */}
                {searchResults.length > 0 && 
                searchResults.map((salon)=>(
                    <Marker 
                        key={salon.place_id} 
                        position={{lat: salon.lat, lng:salon.lng}}
                        icon="./assets/icons/seat.png"
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
                        <p>Ratings: {selectedPlace.rating}</p>
                        <p>Total Reviews: {selectedPlace.user_ratings_total}</p>
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
            setValue,
            suggestions: { status, data },
            clearSuggestions,
        } = usePlacesAutocomplete();

        const handleSelect = async (address) => {
            setValue(address, false);
            clearSuggestions();
            const results = await getGeocode({ address });
            const { lat, lng } = await getLatLng(results[0]);
            setSelected({lat: lat, lng: lng });
            searchNearbySalon(lat, lng);
        };

        return (
            <>
                <Row className="my-3">
                    <Col xs={12} md={9} lg={10}>
                        <Combobox onSelect={handleSelect}>
                        <ComboboxInput
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                            disabled={!ready}
                            className="combobox-input"
                            placeholder="Search an address"
                        />
                        <ComboboxPopover>
                            <ComboboxList>
                            {status === "OK" &&
                                data.map(({ place_id, description }) => (
                                <ComboboxOption key={place_id} value={description} />
                                ))}
                            </ComboboxList>
                        </ComboboxPopover>
                        </Combobox>
                    </Col>
                    <Col xs="auto" md="auto">
                        <Button variant="outline-info" onClick={locateUserLocation}><IoMdLocate /> Use current location</Button>
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
                setAddress(`${position.coords.latitude}, ${position.coords.longitude}`)
            },
            function(error) {
                // setGeoError(error);
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
            }
            
        })
        .catch(error => alert(error))
    }

	useEffect(() => {
        
	}, [])

    return (
        <>
            <Container>
                <PlacesAutocomplete setSelected={setSelected} />
            </Container>
            {/* <Container>
         
            
            </Container> */}
            <Container class="main-container">
                <Row>
                    <Col sm={8}>{isLoaded && <Map />}</Col>
                    <Col sm={4} className="results-col">
                        <p>{resultsLength} results found</p>
         
                        {( resultsLength >0 ) ? (
                            <ListGroup>
                                {searchResults.map((salon) => (
                                    <ListGroup.Item
                                        as="li"
                                        className="d-flex align-items-start"
                                        key={salon.place_id}
                                    >
                                        <Card border='primary' className="salon-card">
                                        <Card.Body>
                                             <Card.Title>{salon.name}</Card.Title>
                                             <ListGroup className="list-group-flush">
                                                 <ListGroup.Item>Ratings: {salon.rating}</ListGroup.Item>
                                                 <ListGroup.Item>Total Reviews: {salon.user_ratings_total}</ListGroup.Item>
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
        </>
    );
}

export default SalonRecommendationView;