import { useEffect } from 'react';
import { checkClipboard } from '../utils/urlUtils';

export function useDownloadManager(setPausedDownloads) {
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

  const handleOpenModal = async (setNewUrl, setShowModal, setShowClipboardToast) => {
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

  const handleDownload = (newUrl, setUrls, setNewUrl, setShowModal) => {
    if (newUrl.trim()) {
      console.log(`Adding new URL: ${newUrl.trim()}`);
      setUrls(prevUrls => [...prevUrls, newUrl.trim()]);
      setNewUrl('');
      setShowModal(false);
    }
  };

  const removeUrl = (url, setUrls, setPausedDownloads) => {
    setUrls(prevUrls => prevUrls.filter(u => u !== url));
    setPausedDownloads(prevDownloads => prevDownloads.filter(download => download.url !== url));
  };

  return {
    handleOpenModal,
    handleDownload,
    removeUrl
  };
}

const isValidURL = (url) => {
  try {
    new URL(url);
    return true;
  } catch (error) {
    return false;
  }
}; 