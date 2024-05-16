import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Navbar, Nav, Container} from 'react-bootstrap';

function NavigationBar() {
  const location = useLocation();

  return (
    <Navbar expand="md" className="navbar-custom shadow py-3">
      <Container>
        <Navbar.Brand href="#"><span></span></Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Link to="/" className={`btn btn-primary ${location.pathname === '/' ? 'active' : ''}`} style={{ 'marginRight': '15px', 'borderRadius': '39px' }}>
              <i className="bi bi-house" style={{'paddingRight': '2px'}}></i> 
              Home
            </Link>
            <Link to="/history" className={`btn btn-primary ${location.pathname === '/history' ? 'active' : ''}`} style={{ 'borderRadius': '30px' }}>
              <i className="bi bi-clock-history" style={{'paddingRight': '2px'}}></i>
              History
            </Link>
          </Nav>
          <Link to="/settings" className={`btn btn-primary ${location.pathname === '/settings' ? 'active' : ''}`} style={{ 'borderRadius': '54px', 'height': '50px', 'width': '50px' }}>
            <i className="bi bi-gear" style={{ 'fontSize': '1.5rem' }}/>
          </Link>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavigationBar;