import React from 'react'
import {Container, Row, Col, Button} from 'react-bootstrap'
import { FaGithub } from 'react-icons/fa';
import {RxDiscordLogo} from 'react-icons/rx'
import {HiOutlineMail} from 'react-icons/hi'
import {SiFlask, SiThreedotjs, SiOpencv, SiReact, SiOnnx, SiTensorflow} from 'react-icons/si'


function Footer() {
  return (
    <footer className='app-footer'>
        <Row className='copyright-section'>
            <Col>
                {/* Built with: */}
                <Button variant="dark"><SiReact /></Button>
                <Button variant="dark"><SiFlask /></Button>
                <Button variant="dark"><SiThreedotjs /></Button>
                <Button variant="dark"><SiOpencv /></Button>
                <Button variant="dark"><SiTensorflow /></Button>
                <Button variant="dark"><SiOnnx /></Button>
            </Col>
            <Col>
                <Container>© {new Date().getFullYear()} Copyright. HairEsthetics. All Rights Reserved</Container>
            </Col>
            <Col>
                <Button variant="dark"><FaGithub /></Button>
                <Button variant="dark"><RxDiscordLogo /></Button>
                <Button variant="dark"><HiOutlineMail /></Button>
            </Col>
        </Row>
    </footer>
  );
}

export default Footer;