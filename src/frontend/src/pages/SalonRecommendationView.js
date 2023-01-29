import React, { useEffect, useState } from "react"
// import Map from "../components/Map";
import { GoogleMap, useLoadScript, Marker } from '@react-google-maps/api';
import {Container, Button, Row, Col, Card, ListGroup, Form, InputGroup} from 'react-bootstrap'
import {FaSearch} from 'react-icons/fa';
import axios from 'axios';

const containerStyle = {
  width: '900px',
  height: '500px'
};

function SalonRecommendationView() {
    const { isLoaded } = useLoadScript({
        // id: 'google-map-script',
        googleMapsApiKey: "",
    })
    const [map, setMap] = useState(null)
    const [geolocation, setGeolocation] = useState (null)
    const [lat, setLat] = useState(null)
    const [lng, setLng] = useState(null)
    const [geoError, setGeoError] = useState(null)
    const [resultsLength, setResultLength] = useState(0)
    const [searchResults, setSearchResults] = useState([])
    const [inputAddress, setAddress] = useState("")

    const onLoad = React.useCallback(function callback(map) {
        // This is just an example of getting and using the map instance!!! don't just blindly copy!
        // const bounds = new window.google.maps.LatLngBounds(center);
        // console.log(lat);
        // <Marker position={{ lat: lat, lng: lng }} icon={{url: require('./placeholder.png')}}/>
        // map.fitBounds(bounds);

        setMap(map)
    }, [])

    const onUnmount = React.useCallback(function callback(map) {
        setMap(null)
    }, [])

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
                setGeoError(error);
                console.error("Error Code = " + error.code + " - " + error.message);
            }
        );
        }else {
            alert("Geolocation is not supported")
        }
	}, [])

    return (
        <>
            {/* {(lat & lng) ? (
                <GoogleMap
                    
                    mapContainerStyle={containerStyle}
                    center={{lat:lat, lng:lng}}
                    zoom={10}
                    // onLoad={onLoad}
                    onUnmount={onUnmount}
                >
                {geolocation && <Marker position={{ lat: lat, lng: lng }} icon={{url: require('./placeholder.png'), scaledSize: new window.google.maps.Size(37, 37)}}/>}
                
                </GoogleMap>
            ) : <div>Loading...</div>} */}
            <Container>
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
            </Container>
            {/* {geolocation ? (<><p>{geolocation.latitude.toFixed(4)}</p>
            <p>{geolocation.longitude.toFixed(4)}</p></>):(<p>Not found</p>)} */}
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