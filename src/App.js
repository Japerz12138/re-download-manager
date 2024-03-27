import React, { useState } from 'react';
import './App.css';
import Navbar from './Navbar';
import DownloadComponent from './components/DownloadComponent';
import { Button, Modal } from 'react-bootstrap';

function App() {
  const [urls, setUrls] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newUrl, setNewUrl] = useState('');

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      const url = event.target.value.trim();
      if (url) {
        setUrls(prevUrls => prevUrls.includes(url) ? prevUrls : [...prevUrls, url]);
        event.target.value = '';
      }
    }
  };

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleUrlChange = (event) => {
    setNewUrl(event.target.value);
  };

  const handleDownload = () => {
    if (newUrl.trim()) {
      setUrls(prevUrls => [...prevUrls, newUrl.trim()]);
      setNewUrl('');
      setShowModal(false);
    }
  };

  return (
    <div className="App">
      <Navbar />

      <div class="container" style={{ 'margin-top': '100px' }}>
        <div class="row">
          <div class="col">
            <div class="card" style={{ 'border-style': 'none' }}>
              {/* Conditional rendering for displaying the message or cards */}
              {urls.length === 0 && (
                <div>
                  <i class="bi bi-dropbox" style={{ fontSize: '2rem', color: 'grey' }}></i>
                  <p class="fs-5 text-muted text-uppercase">Nothing Here</p>
                  <p className="text-muted">Press + to start a download</p>
                </div>
              )}
              {urls.map((url) => <DownloadComponent key={url} url={url} />)}
            </div>
          </div>
        </div>
      </div>

      <Button className="fab-btn" onClick={handleOpenModal}>
        <i className="bi bi-plus"></i>
      </Button>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Enter Download URL</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input type="text" value={newUrl} onChange={handleUrlChange} className="form-control" placeholder="Enter URL" />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleDownload}>
            Download
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default App;
