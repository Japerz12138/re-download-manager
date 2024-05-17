import React from 'react';
import logo from '../assets/images/RDM.png';
import { Container, Row, Col, Button, Image } from 'react-bootstrap';
import styles from '../assets/css/OobeScreen.module.css';

function OobeScreen({ onCompleted }) {
    return (
        <div className={styles['oobe-screen']}>
            <Container fluid className={styles['oobe-container']}>
                <Row className="text-center">
                    <Col>
                        <Image src={logo} alt="Logo" width="100" height="100" />
                    </Col>
                </Row>
                <Row className="text-center mt-3">
                    <Col>
                        <h1 className={styles['welcome-text']}>Welcome to</h1>
                        <h2 className={styles['rdm-title']}>Re Download Manager</h2>
                    </Col>
                </Row>
                <Row className="text-center mt-4">
                    <Button
                        variant="primary"
                        size="lg"
                        className={`rounded-circle p-3 d-flex justify-content-center align-items-center ${styles['oobe-button']}`}
                        onClick={onCompleted}
                    >
                        <i className="bi bi-arrow-right" style={{ fontSize: '1.5rem' }}></i>
                    </Button>
                </Row>
                <Row className="text-center mt-4">
                    <Col>
                        <p className={styles['team-signature']}>by</p>
                        <h4 className={styles['team-name']}>Team RDM</h4>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default OobeScreen;
