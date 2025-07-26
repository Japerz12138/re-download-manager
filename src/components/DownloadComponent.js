import React, { useState, useEffect, useRef } from 'react';
import DownloadProgress from './DownloadProgress';

// Global state to track started downloads across component re-mounts
const startedDownloads = new Set();

const useStartDownload = (url, isResumed, initialState, isPaused, currentDownload, setDownloadInfo, handleDownloadProgress, removeUrl, downloadStartedRef, isCompleted, setIsCompleted, isProcessing, setIsProcessing) => {
  useEffect(() => {
    let id;
    
    if (currentDownload.current.id === null && !isResumed) {
      id = initialState ? initialState.id : Date.now();
      console.log(`Generated id: ${id}`);
      currentDownload.current = { url, id };
    } else {
      id = currentDownload.current.id;
    }
    console.log(`Generated id: ${id}`);
    currentDownload.current = { url, id };
    let isMounted = true;
    
    handleDownloadProgress.current = (info) => {
      if (!isMounted || info.id !== id) return;
      
      // Update download info
      setDownloadInfo(prevDownloadInfo => ({
        ...prevDownloadInfo,
        shardProgress: prevDownloadInfo.shardProgress.map((progress, index) => index === info.shardIndex ? info.progress : progress),
        fileName: info.fileName,
        fileSize: info.fileSize,
        speed: info.speed,
        eta: info.eta,
        downloadFolderPath: info.downloadFolderPath,
      }));
    };

    // Listen for download completion event
    const handleDownloadComplete = (completedId) => {
      if (completedId === id && !isCompleted) {
        console.log(`Download ${id} actually completed, starting combining phase`);
        setIsProcessing(true);
        // After combining is done, show completion
        setTimeout(() => {
          console.log(`Download ${id} combining finished, marking as completed`);
          setIsCompleted(true);
          setIsProcessing(false);
          // Remove the completed download after a short delay
          setTimeout(() => {
            console.log(`Removing completed download ${id} from list`);
            startedDownloads.delete(id); // Clean up global state
            removeUrl(url);
          }, 2000); // 2 second delay to show completion
        }, 5000); // 5 second delay for file combining
      }
    };

    window.electron.onDownloadProgress(id, handleDownloadProgress.current);
    window.electron.onDownloadComplete(id, handleDownloadComplete);
    
    if (!isResumed && !(initialState && isPaused) && !isPaused && !downloadStartedRef.current) {
      // Check if this download is already started globally
      if (!startedDownloads.has(id)) {
        downloadStartedRef.current = true;
        startedDownloads.add(id);
        window.electron.startDownload(url, id, isPaused);
        console.log(`Starting download with id: ${id}`);
      } else {
        console.log(`Download ${id} already started globally, not re-starting`);
        downloadStartedRef.current = true; // Mark as started to prevent re-starting
      }
    }
    
    return () => {
      isMounted = false;
      window.electron.offDownloadProgress(id);
      window.electron.offDownloadComplete(id);
    };
  }, [url, isResumed, initialState, isPaused, setDownloadInfo, handleDownloadProgress, currentDownload, removeUrl, downloadStartedRef, isCompleted, setIsCompleted, isProcessing, setIsProcessing]);
};

const useHandleActions = (isPaused, currentDownload) => {
  useEffect(() => {
    console.log('useEffect triggered for handling pause and cancel actions');
    if (isPaused) {
      window.electron.pauseDownload(currentDownload.current.id);
    }
  }, [isPaused, currentDownload]);
};

/**
 * Represents a component for downloading files.
 *
 * @param {Object} props - The component props.
 * @param {string} props.url - The URL of the file to download.
 * @param {function} props.removeUrl - The function to remove the URL from the download list.
 * @param {Object} props.initialState - The initial state of the download, if one exists.
 * @returns {JSX.Element} The DownloadComponent JSX element.
 */
function DownloadComponent({ url, removeUrl, initialState }) {
  const [numShards, setNumShards] = useState(8);
  const downloadStartedRef = useRef(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    window.electron.getSettings().then((settings) => {
      setNumShards(settings.threadNumber);
    });
  }, []);

  const [downloadInfo, setDownloadInfo] = useState({
    shardProgress: initialState
      ? initialState.totalBytesDownloaded.map(bytes => ((bytes / initialState.fileSize) * 100) / initialState.totalBytesDownloaded.length)
      : Array(numShards).fill(0),
    
    fileName: initialState ? initialState.fileName : 'Requesting download...',
    fileSize: initialState ? initialState.fileSize : 0,
    speed: 0,
    eta: 0,
    downloadFolderPath: initialState ? initialState.downloadFolderPath : '',
  });

  const [isCancelled, setIsCancelled] = useState(initialState ? initialState.isCancelled : false);
  const [isPaused, setIsPaused] = useState(initialState ? true : false);
  const [isResumed, setIsResumed] = useState(false);
  const currentDownload = useRef({ url: initialState ? initialState.url : null, id: initialState ? initialState.id : null });
  const handleDownloadProgress = useRef(null);

  //custom hook for this since this handles persistant states, apparently this is good practice
  useStartDownload(url, isResumed, initialState, isPaused, currentDownload, setDownloadInfo, handleDownloadProgress, removeUrl, downloadStartedRef, isCompleted, setIsCompleted, isProcessing, setIsProcessing);
  useHandleActions(isCancelled, isPaused, currentDownload);

  const cancelDownload = () => {
    if (currentDownload.current.id !== null) {
      setIsCancelled(true);
      console.log(`Request to cancel download with id: ${currentDownload.current.id}`);
      window.electron.cancelDownload(currentDownload.current.id);
      console.log('Download cancelled');
      startedDownloads.delete(currentDownload.current.id); // Clean up global state
      removeUrl(url);
    } else {
      console.error('No download to cancel');
    }
  };

  const pauseDownload = () => {
    setIsPaused(true);
    console.log(`isPaused set to: ${isPaused}`);
    console.log(`Request to pause download with id: ${currentDownload.current.id}`);
    window.electron.pauseDownload(currentDownload.current.id);
    console.log('Download paused');
  };

  const resumeDownload = () => {
    if (!isResumed) {
      setIsResumed(true);
      setIsPaused(false);
      console.log(`isResumed set to: ${isResumed}`);
      console.log(`Request to resume download with id: ${currentDownload.current.id}`);
      window.electron.resumeDownload(currentDownload.current.id, handleDownloadProgress.current);
      console.log('Download resumed');
    }
  };

  const totalProgress = downloadInfo.shardProgress.reduce((a, b) => a + b, 0) / numShards;

  return (
    <DownloadProgress
      key={currentDownload.current.id}
      progress={totalProgress}
      fileName={downloadInfo.fileName}
      fileSize={downloadInfo.fileSize}
      downloadFolderPath={downloadInfo.downloadFolderPath}
      speed={downloadInfo.speed}
      eta={downloadInfo.eta}
      cancelDownload={cancelDownload}
      pauseDownload={pauseDownload}
      resumeDownload={resumeDownload}
      isResumed={isResumed}
      isPaused={isPaused}
      isCompleted={isCompleted}
      isProcessing={isProcessing}
    />
  );
}

export default DownloadComponent;