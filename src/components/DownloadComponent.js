import React, { useState, useEffect, useRef } from 'react';
import DownloadProgress from './DownloadProgress';
/**
 * Represents a component for downloading files.
 *
 * @param {Object} props - The component props.
 * @param {string} props.url - The URL of the file to download.
 * @param {Function} props.removeUrl - The function to remove the URL from the download list.
 * @returns {JSX.Element} The DownloadComponent JSX element.
 */
function DownloadComponent({ url, removeUrl }) {
  const [downloadInfo, setDownloadInfo] = useState({
    shardProgress: [0, 0, 0, 0],
    fileName: 'Requesting download...',
    fileSize: 0,
    speed: 0,
    eta: 0,
  });

  const [isCancelled, setIsCancelled] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isResumed, setIsResumed] = useState(false);
  const currentDownload = useRef({ url: null, id: null });
  const handleDownloadProgress = useRef(null);
  const downloadId = useRef(0);

  useEffect(() => {
    console.log('useEffect triggered for starting a new download');
    if (currentDownload.current.id !== null) {
      window.electron.offDownloadProgress(currentDownload.current.id);
    }
    const id = isResumed ? currentDownload.current.id : Date.now();
    console.log(`Generated id: ${id}`);
    currentDownload.current = { url, id };
    let isMounted = true;
    handleDownloadProgress.current = (info) => {
      if (!isMounted || info.id !== id) return;
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
    window.electron.onDownloadProgress(id, handleDownloadProgress.current);
    if (!isResumed) { 
      window.electron.startDownload(url, id, isPaused);
      console.log(`Starting download with id: ${id}`);
    }
    return () => {
      isMounted = false;
      window.electron.offDownloadProgress(id);
    };
  }, [url, isResumed]);


  useEffect(() => {
    console.log('useEffect triggered for handling pause and cancel actions');
    if (isCancelled) {
      window.electron.cancelDownload(currentDownload.current.id);
    }
    if (isPaused) {
      window.electron.pauseDownload(currentDownload.current.id);
    }
  }, [isCancelled, isPaused]);

  const cancelDownload = () => {
    setIsCancelled(true);
    console.log(`Request to cancel download with id: ${currentDownload.current.id}`);
    window.electron.cancelDownload(currentDownload.current.id);
    console.log('Download cancelled');
    removeUrl(url);
  };

  const pauseDownload = () => {
    setIsPaused(true);
    console.log(`isPaused set to: ${isPaused}`);
    console.log(`Request to pause download with id: ${currentDownload.current.id}`);
    window.electron.pauseDownload(currentDownload.current.id);
    console.log('Download paused');
  };

  const resumeDownload = () => {
    setIsResumed(true);
    setIsPaused(false);
    console.log(`isResumed set to: ${isResumed}`);
    console.log(`Request to resume download with id: ${currentDownload.current.id}`);
    window.electron.resumeDownload(currentDownload.current.id, handleDownloadProgress.current);
    console.log('Download resumed');
  };

  const totalProgress = downloadInfo.shardProgress.reduce((a, b) => a + b, 0) / 4;

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
    />
  );
}

export default DownloadComponent;