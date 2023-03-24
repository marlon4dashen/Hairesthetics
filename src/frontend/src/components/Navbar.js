import React from 'react'
import {Container, Nav, Navbar} from 'react-bootstrap'
import { Link } from 'react-router-dom';



function Header() {

  return (
    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark" className = "app-header">
      <Container>

        <Navbar.Brand as={Link} to="/">
          HairEsthetics
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/style">Hair Style</Nav.Link>
            <Nav.Link as={Link} to="/color">Hair Color</Nav.Link>
            <Nav.Link as={Link} to="/salon">Salon Recommendation</Nav.Link>
          </Nav>
          {/* Right Side */}
          {/* <Nav>
            <Nav.Link href="#deets">Help</Nav.Link>
            <Nav.Link eventKey={2} href="#memes">
              Contact
            </Nav.Link>
          </Nav> */}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;