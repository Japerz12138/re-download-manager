import React, { useState, useEffect, useRef } from 'react';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Navbar from './Navbar';
import DownloadComponent from './components/DownloadComponent';
import Settings from './pages/settings';
import History from './pages/history';
import { Button, Modal, Toast } from 'react-bootstrap';


function HomePage() {
  const [urls, setUrls] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newUrl, setNewUrl] = useState('');
  const [showClipboardToast, setShowClipboardToast] = useState(false); // State for clipboard toast
  const urlInputRef = useRef(null); // Ref for the input field
  const [theme, setTheme] = useState(null);

  // Function to check if there's a URL in the clipboard
  const checkClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (isValidURL(text)) {
        setNewUrl(text);
        setShowModal(true);
        setShowClipboardToast(true); // Show clipboard toast
        setTimeout(() => setShowClipboardToast(false), 3000); // Hide toast after 3 seconds
      }
    } catch (error) {
      console.error('Error reading clipboard:', error);
    }
  };

  // Function to check if a string is a valid URL
  const isValidURL = (url) => {
    try {
      new URL(url);
      return true;
    } catch (error) {
      return false;
    }
  };

  useEffect(() => {

    const fetchTheme = async () => {
      try {
        const response = await window.electron.getSettings();
        setTheme(response.theme);
      } catch (error) {
        console.error('Error fetching theme from settings:', error);
      }
    };
    fetchTheme();

    checkClipboard();

    window.addEventListener('focus', handleWindowFocus);

    return () => {
      window.removeEventListener('focus', handleWindowFocus);
    };
  }, []);

  // Function to handle focus event on window
  const handleWindowFocus = () => {
    checkClipboard();
  };

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
      console.log(`Adding new URL: ${newUrl.trim()}`);
      setUrls(prevUrls => [...prevUrls, newUrl.trim()]);
      setNewUrl('');
      setShowModal(false);
    }
  };

  const removeUrl = (url) => {
    setUrls(prevUrls => prevUrls.filter(u => u !== url));
  };

  if (theme === null) {
    return <div>Loading...</div>;
  }

  if (theme === 'Dark') {
    const htmlElement = document.querySelector('html');
    htmlElement.setAttribute('data-bs-theme', 'dark');
  } else {
    const htmlElement = document.querySelector('html');
    htmlElement.setAttribute('data-bs-theme', 'light');
  }

  return (
    <div className="App">
      <Toast show={showClipboardToast} onClose={() => setShowClipboardToast(false)} style={{ position: 'fixed', top: '0', right: '0', margin: '1rem', zIndex: '10000' }}>
        <Toast.Body><i class="bi bi-clipboard-check"></i>  URL detected in clipboard!</Toast.Body>
      </Toast>

      <div className="container" style={{ marginTop: '100px' }}>
        <div className="row">
          <div className="col">
            <div className="card" style={{ borderStyle: 'none' }}>
              {/* Conditional rendering for displaying the message or cards */}
              {urls.length === 0 && (
                <div>
                  <i className="bi bi-dropbox" style={{ fontSize: '2rem', color: 'grey' }}></i>
                  <p className="fs-5 text-muted text-uppercase">Nothing Here</p>
                  <p className="text-muted">Press + to start a download</p>
                </div>
              )}
              {urls.map((url) => <DownloadComponent key={url} url={url} removeUrl={removeUrl} />)}
            </div>
          </div>
        </div>
      </div>

      <Button className="fab-btn" onClick={handleOpenModal}>
        <i className="bi bi-plus"></i>
      </Button>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title><i class="bi bi-link-45deg"></i>  Enter Download URL</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input ref={urlInputRef} type="text" value={newUrl} onChange={handleUrlChange} className="form-control" placeholder="Enter URL" />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleDownload}>
            <i class="bi bi-download"></i>  Download
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/history" element={<History />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Router>
  );
}

export default App;
