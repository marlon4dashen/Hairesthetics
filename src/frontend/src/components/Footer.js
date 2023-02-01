import React from 'react'
import {Container, Row, Col, Button} from 'react-bootstrap'
import { FaGithub } from 'react-icons/fa';
import {RxDiscordLogo} from 'react-icons/rx'
import {HiOutlineMail} from 'react-icons/hi'
import {SiFlask, SiPython, SiThreedotjs, SiOpencv, SiJavascript, SiReact, SiOnnx, SiTensorflow} from 'react-icons/si'

function Footer() {
  return (
    <footer className='app-footer'>
        <Row className='copyright-section'>
            <Col>
                {/* Built with: */}
                <Button variant="secondary"><SiReact /></Button>
                <Button variant="secondary"><SiJavascript/></Button>
                <Button variant="secondary"><SiFlask /></Button>
                <Button variant="secondary"><SiPython /></Button>
                <Button variant="secondary"><SiThreedotjs /></Button>
                <Button variant="secondary"><SiOpencv /></Button>
                <Button variant="secondary"><SiTensorflow /></Button>
                <Button variant="secondary"><SiOnnx /></Button>
            </Col>
            <Col>
                <Container>© {new Date().getFullYear()} Copyright: HairEsthetics. All Rights Reserved</Container>
            </Col>
            <Col>
                <Button variant="secondary"><FaGithub /></Button>
                <Button variant="secondary"><RxDiscordLogo /></Button>
                <Button variant="secondary"><HiOutlineMail /></Button>
            </Col>
        </Row>
    </footer>
  );
}

export default Footer;