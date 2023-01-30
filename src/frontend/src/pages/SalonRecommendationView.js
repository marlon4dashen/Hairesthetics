import React, { useEffect, useState, useMemo } from "react"
import {Container, Button, Row, Col, Card, ListGroup, Form, InputGroup} from 'react-bootstrap'
import {FaSearch} from 'react-icons/fa';
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
    
    const [geolocation, setGeolocation] = useState (null)
    const [lat, setLat] = useState(null)
    const [lng, setLng] = useState(null)
    const [resultsLength, setResultLength] = useState(0)
    const [searchResults, setSearchResults] = useState([])
    const [inputAddress, setAddress] = useState("")

    function Map() {
        const center = useMemo(() => ({ lat: 43.45, lng: -80.49 }), []);
        const [selected, setSelected] = useState(null);
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
            <div >
                <PlacesAutocomplete setSelected={setSelected} />
            </div>
         
            <GoogleMap
                zoom={10}
                center={center}
                mapContainerClassName="map-container"
            >
                {/* {selected && <Marker position={selected} />} */}
                {searchResults.length > 0 && 
                searchResults.map((salon)=>(
                    <Marker 
                        key={salon.place_id} 
                        position={{lat: salon.lat, lng:salon.lng}}
                        onClick={() => {
                            setSelectedPlace(salon);
                        }}
                    />
                ))}
                {selectedPlace && (
                <InfoWindow
                    // info window open at clicked location
                    position={{lat: selectedPlace.lat, lng: selectedPlace.lng}}
                    // after clicking the close button
                    onCloseClick={() => {
                        setSelectedPlace(null);
                    }}
                >
                    {/* Display location information */}
                    <div className="infoWindow" style={{fontWeight: 'bold', color: 'blue'}}>
                        <p>{selectedPlace.name}</p>
                        {/* <p>Capacity: {selectedPlace.BICYCLE_CAPACITY}</p>
                        {props.showLink && (
                            <p><a href={`./single/id=${selectedPlace.id}`}>More Details</a></p>
                        )} */}
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
            setSelected({ lat, lng });
        };

        return (
            <>
                <InputGroup className="my-3">
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
                    {/* <Button variant="outline-primary" onClick={searchNearbySalon}>
                        <FaSearch />
                    </Button> */}
                    <Button variant="outline-info" onClick={searchNearbySalon}>Use current location</Button>
                </InputGroup>
            </>
        );
    };

    const searchNearbySalon = () => {
        axios.get(`http://localhost:5001/salons?lat=${lat}&lng=${lng}`)
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
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
            function(position) {
                setGeolocation(position.coords);
                setLat(position.coords.latitude);
                setLng(position.coords.longitude);
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
	}, [])

    return (
        <>
        {/* <MapGL className="map-container" /> */}
            {/* <Container>
                <InputGroup className="my-3">
                    <Form.Control
                        placeholder="Enter a street address"
                        aria-label="Recipient's username"
                        aria-describedby="basic-addon2"
                        value={inputAddress}
                    />
                    <Button variant="outline-primary" onClick={searchNearbySalon}>
                        <FaSearch />
                    </Button>
                    <Button variant="outline-info" onClick={searchNearbySalon}>Use current location</Button>
                </InputGroup>
            </Container> */}
            <Container>
            {/* <Places /> */}
            {isLoaded && <Map />}
            </Container>
            <Container fluid>
                <p>{resultsLength} results found</p>
                {( resultsLength >0 ) ? (
                    <Row className="my-2" xs={1} md={2} lg={4}>
                        {searchResults.map((salon) => (
                            <Col key={salon.place_id}>
                            <Card border='primary'>
                                <Card.Body>
                                    <Card.Title>{salon.name}</Card.Title>
                                    <ListGroup className="list-group-flush">
                                        <ListGroup.Item>Ratings: {salon.rating}</ListGroup.Item>
                                        <ListGroup.Item>Total Reviews: {salon.user_ratings_total}</ListGroup.Item>
                                    </ListGroup>
                                </Card.Body>
                            </Card>
                            </Col>
                        ))}
                    </Row>
                ): <></>}
            </Container>
        </>
    );
}

export default SalonRecommendationView;