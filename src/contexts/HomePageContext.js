import React, { useState, useEffect, useRef, createContext, useContext } from 'react';
import OobeScreen from '../pages/oobe';

const HomePageContext = createContext();

export function HomePageProvider({ children }) {
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

export function useHomePageState() {
  const context = useContext(HomePageContext);
  if (context === undefined) {
    throw new Error('useHomePageState must be used within a HomePageProvider');
  }
  return context;
} 