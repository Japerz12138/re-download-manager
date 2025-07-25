import React, { useState, useEffect, useRef, createContext, useContext } from 'react';
import { HashRouter as Router, Route, Routes, useLocation, Outlet } from 'react-router-dom';
import './App.css';
import Navbar from './Navbar';
import DownloadComponent from './components/DownloadComponent';
import Settings from './pages/settings';
import { settingsChangedEvent } from './pages/settings';
import History from './pages/history';
import { Button, Modal, Toast, FloatingLabel } from 'react-bootstrap';
import OobeScreen from './pages/oobe';

const HomePageContext = createContext();

function HomePageProvider({ children }) {
  const [showOobe, setShowOobe] = useState(false);
  const [urls, setUrls] = useState([]);
  const [pausedDownloads, setPausedDownloads] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newUrl, setNewUrl] = useState('');
  const [showClipboardToast, setShowClipboardToast] = useState(false);
  const urlInputRef = useRef(null);
  const [theme, setTheme] = useState(null);


  useEffect(() => {
    const oobeShown = localStorage.getItem('oobeShown');
    if (!oobeShown) {
      setShowOobe(true);
    }
  }, []);

  const handleOobeCompleted = () => {
    localStorage.setItem('oobeShown', 'true');
    setShowOobe(false);
  };

  return (
    <HomePageContext.Provider value={{
      urls, setUrls, showModal, setShowModal, newUrl, setNewUrl,
      showClipboardToast, setShowClipboardToast, urlInputRef, theme, setTheme,
      pausedDownloads, setPausedDownloads
    }}>
      {showOobe ? <OobeScreen onCompleted={handleOobeCompleted} /> : (children)}
    </HomePageContext.Provider>
  );
}

function useHomePageState() {
  const context = useContext(HomePageContext);
  if (context === undefined) {
    throw new Error('useHomePageState must be used within a HomePageProvider');
  }
  return context;
}

/**
 * Represents the home page component.
 *
 * @returns {JSX.Element} The rendered home page component.
 */
function HomePage() {
  const {
    urls, setUrls, showModal, setShowModal, newUrl, setNewUrl,
    showClipboardToast, setShowClipboardToast, urlInputRef, theme, setTheme,
    pausedDownloads, setPausedDownloads
  } = useHomePageState();

  const location = useLocation();
  const isVisible = location.pathname === '/';

  // const checkClipboard = async () => {
  //   try {
  //     const text = await navigator.clipboard.readText();
  //     if (isValidURL(text)) {
  //       setNewUrl(text);
  //       setShowModal(true);
  //       setShowClipboardToast(true);
  //       setTimeout(() => setShowClipboardToast(false), 3000);
  //     }
  //   } catch (error) {
  //     console.error('Error reading clipboard:', error);
  //   }
  // };

  const isValidURL = (url) => {
    try {
      new URL(url);
      return true;
    } catch (error) {
      return false;
    }
  };

  useEffect(() => {
    const loadPausedDownloads = async () => {
      try {
        const paused = await window.electron.getPausedDownloads();
        setPausedDownloads(paused);
      } catch (error) {
        console.error('Error loading paused downloads:', error);
      }
    };
    loadPausedDownloads();
  }, [setPausedDownloads]);

  useEffect(() => {
    const fetchTheme = async () => {
      try {
        const response = await window.electron.getSettings();
        setTheme(response.theme);
        document.documentElement.style.setProperty('--main-color', response.color);
      } catch (error) {
        console.error('Error fetching theme from settings:', error);
      }
    };
    fetchTheme();

    window.addEventListener('focus', handleWindowFocus);

    const handleSettingsChange = ({ setting, value }) => {
      if (setting === 'theme') {
        setTheme(value);
      }
    };

    settingsChangedEvent.on('settingsChanged', handleSettingsChange);

    return () => {
      window.removeEventListener('focus', handleWindowFocus);
      settingsChangedEvent.off('settingsChanged', handleSettingsChange);
    };
  }, [setTheme]);



  useEffect(() => {
    if (theme === 'Dark') {
      const htmlElement = document.querySelector('html');
      htmlElement.setAttribute('data-bs-theme', 'dark');
    } else {
      const htmlElement = document.querySelector('html');
      htmlElement.setAttribute('data-bs-theme', 'light');
    }
  }, [theme]);

  const handleWindowFocus = () => {
    //checkClipboard();
  };

  const handleOpenModal = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (isValidURL(text)) {
        setNewUrl(text);
        setShowModal(true);
        setShowClipboardToast(true);
        setTimeout(() => setShowClipboardToast(false), 3000);
      } else {
        setShowModal(true);
      }
    } catch (error) {
      console.error('Error reading clipboard:', error);
    }
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
    setPausedDownloads(prevDownloads => prevDownloads.filter(download => download.url !== url));
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
    <div className="App transAnimation">
      <div style={{ display: isVisible ? 'block' : 'none' }}>
        <Toast show={showClipboardToast} onClose={() => setShowClipboardToast(false)} style={{ position: 'fixed', top: '0', right: '0', margin: '1rem', zIndex: '10000' }}>
          <Toast.Body><i className="bi bi-clipboard-check"></i>  URL detected in clipboard!</Toast.Body>
        </Toast>

        <div className="container" style={{ marginTop: '100px' }}>
          <div className="row">
            <div className="col">
              <div className="card" style={{ borderStyle: 'none' }}>
                {/* Conditional rendering for displaying the message or cards */}
                {urls.length === 0 && pausedDownloads.length === 0 && (
                  <div>
                    <i className="bi bi-dropbox" style={{ fontSize: '2rem', color: 'grey' }}></i>
                    <p className="fs-5 text-muted text-uppercase">Nothing Here</p>
                    <p className="text-muted">Press + to start a download</p>
                  </div>
                )}
                {urls.map((url) => <DownloadComponent key={url} url={url} removeUrl={removeUrl} />)}
                {pausedDownloads.map(download => (
                  <DownloadComponent key={download.id} url={download.url} initialState={download} removeUrl={removeUrl} />
                ))}
              </div>
            </div>
          </div>
        </div>

        <FloatingLabel controlId="floatingButton" label="">
          <Button className="fab-btn" onClick={handleOpenModal}>
            <i className="bi bi-plus"></i>
          </Button>
        </FloatingLabel>

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
      </div>
      <Outlet />
    </div>
  );
}

function App() {
  return (
    <Router>
      <HomePageProvider>
        <Navbar />
        <div className="transAnimation">
          <Routes>
            <Route path="/" element={<HomePage />}>
              <Route path="history" element={<History />} />
              <Route path="settings" element={<Settings />} />
            </Route>
          </Routes>
        </div>
      </HomePageProvider>
    </Router>
  );
}

export default App;