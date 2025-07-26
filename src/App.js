import React from 'react';
import { HashRouter as Router, Route, Routes, useLocation, Outlet } from 'react-router-dom';
import './App.css';
import Navbar from './Navbar';
import Settings from './pages/settings';
import History from './pages/history';
import { HomePageProvider, useHomePageState } from './contexts/HomePageContext';
import { useThemeManager } from './hooks/useThemeManager';
import { useDownloadManager } from './hooks/useDownloadManager';
import UrlInputModal from './components/UrlInputModal';
import ClipboardToast from './components/ClipboardToast';
import FloatingActionButton from './components/FloatingActionButton';
import DownloadList from './components/DownloadList';

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

  // Use custom hooks for better organization
  useThemeManager(theme, setTheme);
  const { handleOpenModal, handleDownload, removeUrl } = useDownloadManager(setPausedDownloads);

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleUrlChange = (event) => {
    setNewUrl(event.target.value);
  };

  const handleDownloadClick = () => {
    handleDownload(newUrl, setUrls, setNewUrl, setShowModal);
  };

  const handleOpenModalClick = () => {
    handleOpenModal(setNewUrl, setShowModal, setShowClipboardToast);
  };

  const handleRemoveUrl = (url) => {
    removeUrl(url, setUrls, setPausedDownloads);
  };

  if (theme === null) {
    return <div>Loading...</div>;
  }

  return (
    <div className="App transAnimation">
      <ClipboardToast 
        showClipboardToast={showClipboardToast} 
        setShowClipboardToast={setShowClipboardToast} 
      />

      <div className="container" style={{ marginTop: '100px' }}>
        <div className="row">
          <div className="col">
            <DownloadList 
              urls={urls} 
              pausedDownloads={pausedDownloads} 
              removeUrl={handleRemoveUrl} 
            />
          </div>
        </div>
      </div>

      <FloatingActionButton onClick={handleOpenModalClick} />

      <UrlInputModal 
        showModal={showModal}
        handleCloseModal={handleCloseModal}
        newUrl={newUrl}
        handleUrlChange={handleUrlChange}
        handleDownload={handleDownloadClick}
        urlInputRef={urlInputRef}
      />
    </div>
  );
}

function App() {
  return (
    <Router>
      <HomePageProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/history" element={<div className="transAnimation"><History /></div>} />
          <Route path="/settings" element={<div className="transAnimation"><Settings /></div>} />
        </Routes>
      </HomePageProvider>
    </Router>
  );
}

export default App;