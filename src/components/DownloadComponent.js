import React, { useState, useEffect, useRef } from 'react';
import DownloadProgress from './DownloadProgress';

/**
 * DownloadComponent is a React component that handles downloading files.
 *
 * @param {Object} props - The component props.
 * @param {string} props.url - The URL of the file to be downloaded.
 * @param {function} props.removeUrl - The function to remove the URL from the list of downloads.
 * @returns {JSX.Element} The rendered DownloadProgress component.
 */
function DownloadComponent({ url, removeUrl }) {
  const [downloadInfo, setDownloadInfo] = useState({
    shardProgress: [0, 0, 0, 0],
    fileName: '',
    fileSize: 0,
    speed: 0,
    eta: 0,
  });

  const [isCancelled, setIsCancelled] = useState(false);
  const currentDownload = useRef({ url: null, id: null });
  const handleDownloadProgress = useRef(null);
  const downloadId = useRef(0);

  useEffect(() => {
    console.log('useEffect triggered');

    if (currentDownload.current.id !== null) {
      window.electron.offDownloadProgress(currentDownload.current.id);
    }

    const id = downloadId.current++;
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
      }));
    };


    window.electron.onDownloadProgress(id, handleDownloadProgress.current);
    window.electron.startDownload(url, id);
    console.log(`Starting download with id: ${id}`);

    return () => {
      isMounted = false;
      window.electron.offDownloadProgress(id);
      if (isCancelled) {
        window.electron.cancelDownload(id);
      }
    };
  }, [url, isCancelled]);

  const cancelDownload = () => {
    setIsCancelled(true);
    console.log(`Request to cancel download with id: ${currentDownload.current.id}`);
    window.electron.cancelDownload(currentDownload.current.id);
    console.log('Download cancelled');
    removeUrl(url);
  };

  const totalProgress = downloadInfo.shardProgress.reduce((a, b) => a + b, 0) / 4;

  return (
    <DownloadProgress
      key={currentDownload.current.id}
      progress={totalProgress}
      fileName={downloadInfo.fileName}
      fileSize={downloadInfo.fileSize}
      speed={downloadInfo.speed}
      eta={downloadInfo.eta}
      cancelDownload={cancelDownload}
    />
  );
}

export default DownloadComponent;