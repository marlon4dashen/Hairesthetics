import React from 'react'
import {Container, Nav, Navbar} from 'react-bootstrap'
import { Link } from 'react-router-dom';

function Header() {
  return (
    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
      <Container>
        <Navbar.Brand as={Link} to="/">Hairesthetics</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            {/* <LinkContainer to="/style"> */}
            <Nav.Link as={Link} to="/style">Hair Style</Nav.Link>
            {/* </LinkContainer> */}
            {/* <LinkContainer to="/color"> */}
            <Nav.Link as={Link} to="/color">Hair Color</Nav.Link>
            {/* </LinkContainer> */}
            {/* <LinkContainer to="/salon"> */}
            <Nav.Link as={Link} to="/salon">Salon Suggestion</Nav.Link>
            {/* </LinkContainer> */}
          </Nav>
          <Nav>
            <Nav.Link href="#deets">Help</Nav.Link>
            <Nav.Link eventKey={2} href="#memes">
              Contact
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;