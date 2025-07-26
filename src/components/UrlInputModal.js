import React from 'react';
import { Button, Modal } from 'react-bootstrap';

function UrlInputModal({ 
  showModal, 
  handleCloseModal, 
  newUrl, 
  handleUrlChange, 
  handleDownload, 
  urlInputRef 
}) {
  return (
    <Modal show={showModal} onHide={handleCloseModal}>
      <Modal.Header closeButton>
        <Modal.Title><i className="bi bi-link-45deg"></i>  Enter Download URL</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <input
          ref={urlInputRef}
          type="text"
          value={newUrl}
          onChange={handleUrlChange}
          onKeyDown={event => event.key === 'Enter' && handleDownload()}
          className="form-control"
          placeholder="Enter URL"
        />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleCloseModal}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleDownload}>
          <i className="bi bi-download"></i>  Download
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default UrlInputModal; 