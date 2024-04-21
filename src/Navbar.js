/**
 * Represents the navigation bar component.
 * @component
 */
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function Navbar() {
  const location = useLocation();

  return (
    <nav className="navbar navbar-expand-md bg-primary shadow py-3">
      <div className="container">
        <a className="navbar-brand d-flex align-items-center" href="#"><span></span></a>
        <button data-bs-toggle="collapse" className="navbar-toggler" data-bs-target="#navcol-1">
          <span className="visually-hidden">Toggle navigation</span>
          <span className="navbar-toggler-icon"></span>
        </button>
        <Link to="/" className={`btn btn-primary ${location.pathname === '/' ? 'active' : ''}`} style={{ 'marginRight': '15px', 'borderRadius': '39px' }}>
        <i class="bi bi-house" style={{'paddingRight': '2px'}}></i> 
          Home
        </Link>
        <Link to="/history" className={`btn btn-primary ${location.pathname === '/history' ? 'active' : ''}`} style={{ 'borderRadius': '30px' }}>
        <i class="bi bi-clock-history" style={{'paddingRight': '2px'}}></i>
          History
        </Link>
        <div className="collapse navbar-collapse" id="navcol-1">
          <ul className="navbar-nav me-auto">
            <li className="nav-item"></li>
            <li className="nav-item"></li>
            <li className="nav-item"><a className="nav-link" href="#"></a></li>
            {/* gear icon */}
          </ul>
          <Link to="/settings" className={`btn btn-primary ${location.pathname === '/settings' ? 'active' : ''}`} style={{ 'borderRadius': '54px', 'height': '50px', 'width': '50px' }}>
            <i class="bi bi-gear" style={{ 'font-size': '1.5rem' }}/>
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
