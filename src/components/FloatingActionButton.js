import React from 'react';
import { Button, FloatingLabel } from 'react-bootstrap';

function FloatingActionButton({ onClick }) {
  return (
    <FloatingLabel controlId="floatingButton" label="">
      <Button className="fab-btn" onClick={onClick}>
        <i className="bi bi-plus"></i>
      </Button>
    </FloatingLabel>
  );
}

export default FloatingActionButton; 