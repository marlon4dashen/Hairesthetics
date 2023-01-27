import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {Container, Button, Row, Col, Card} from 'react-bootstrap'

class HomeView extends Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    }
    render() {
        return (
        <>
        <Container fluid>
            <h1>Hairesthetics</h1>
                <Row xs={1} md={2} lg={4} className="g-4">
                    <Col>
                        {/* <Card style={{ width: '18rem' }}> */}
                        <Card border="info" >
                        <Card.Img variant="top" src="holder.js/100px180" />
                        <Card.Body>
                            <Card.Title>Face Mesh</Card.Title>
                            <Card.Text>
                            blah
                            </Card.Text>
                            <Button variant="outline-primary"><Link to="/face">Face Mesh</Link></Button>
                        </Card.Body>
                        </Card>
                    </Col>
                    <Col>
                        {/* <Card style={{ width: '18rem' }}> */}
                        <Card border="info" >
                        <Card.Img variant="top" src="holder.js/100px180" />
                        <Card.Body>
                            <Card.Title>Hair Style</Card.Title>
                            <Card.Text>
                            blah
                            </Card.Text>
                            <Button variant="outline-primary"><Link to="/style">Hair Style</Link></Button>
                        </Card.Body>
                        </Card>
                    </Col>
                    <Col>
                        {/* <Card style={{ width: '18rem' }}> */}
                        <Card border="info" >
                        <Card.Img variant="top" src="holder.js/100px180" />
                        <Card.Body>
                            <Card.Title>Hair Color</Card.Title>
                            <Card.Text>
                            blah
                            </Card.Text>
                            <Button variant="outline-primary"><Link to="/color">Try it out</Link></Button>
                        </Card.Body>
                        </Card>
                    </Col>
                    <Col>
                        {/* <Card style={{ width: '18rem' }}> */}
                        <Card border="info" >
                        <Card.Img variant="top" src="holder.js/100px180" />
                        <Card.Body>
                            <Card.Title>Salon Recommendation</Card.Title>
                            <Card.Text>
                            blah
                            </Card.Text>
                            <Button variant="outline-primary"><Link to="/">Try it out</Link></Button>
                        </Card.Body>
                        </Card>
                    </Col>
                </Row>
        </Container>
        </>
        )
    }
}


export default HomeView;