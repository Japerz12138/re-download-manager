
import React, { useState, useEffect, useRef } from 'react';
import DownloadProgress from './DownloadProgress';

let downloadId = 0;

/**
 * Represents a component that handles downloading a file.
 *
 * @param {Object} props - The component props.
 * @param {string} props.url - The URL of the file to download.
 * @returns {JSX.Element} The rendered component.
 */
function DownloadComponent({ url }) {
  const [downloadInfo, setDownloadInfo] = useState({
    shardProgress: [0, 0, 0, 0],
    fileName: '',
    fileSize: 0,
    speed: 0,
    eta: 0,
  });

  const currentDownload = useRef({ url: null, id: null });
  const handleDownloadProgress = useRef(null);

  useEffect(() => {

    if (currentDownload.current.id !== null) {
      window.electron.offDownloadProgress(currentDownload.current.id);
    }


    const id = downloadId++;
    currentDownload.current = { url, id };
    console.log(`useEffect triggered. url: ${url}, id: ${currentDownload.current.id}`);

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

    return () => {
      isMounted = false;
      window.electron.offDownloadProgress(id);
    };
  }, [url]);


  const totalProgress = downloadInfo.shardProgress.reduce((a, b) => a + b, 0) / 4;

  return (
    <DownloadProgress
      key={currentDownload.current.id}
      progress={totalProgress}
      fileName={downloadInfo.fileName}
      fileSize={downloadInfo.fileSize}
      speed={downloadInfo.speed}
      eta={downloadInfo.eta}
    />
  );
}

export default DownloadComponent;