import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {Container, Button, ButtonGroup} from 'react-bootstrap'

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
                <ButtonGroup size="lg" className="mb-2">
                    <Button><Link to="/face">Face Mesh</Link></Button>
                    <Button><Link to="/style">Hair Style</Link></Button>
                    <Button><Link to="/color">Hair Color</Link></Button>
                    <Button>Salon Recommendation</Button>
                </ButtonGroup>
        </Container>
        </>
        )
    }
}


export default HomeView;