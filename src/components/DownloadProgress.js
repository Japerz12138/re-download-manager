import React, { useState, useEffect } from 'react';

//universal path for now
let downloadPath = '';

function getFileIcon(fileName) {
  const lastDotIndex = fileName.lastIndexOf('.');
  if (lastDotIndex === -1) {
    return <i className="bi bi-file-earmark"></i>;
  }
  const extension = fileName.substring(lastDotIndex + 1).toLowerCase();
  switch (extension) {
    case 'png':
    case 'jpg':
    case 'jpeg':
      return <i className="bi bi-file-earmark-image" style={{ 'font-size': '1.5rem' }}></i>;
    case 'pdf':
      return <i className="bi bi-file-earmark-pdf" style={{ 'font-size': '1.5rem' }}></i>;
    case 'exe':
      return <i className="bi bi-filetype-exe" style={{ 'font-size': '1.5rem' }}></i>;
    default:
      return <i className="bi bi-file-earmark" style={{ 'font-size': '1.5rem' }}></i>;
  }
}

function formatFileSize(bytes) {
  if (bytes < 1024) {
    return bytes + ' B';
  } else if (bytes < 1024 * 1024) {
    return (bytes / 1024).toFixed(2) + ' KB';
  } else if (bytes < 1024 * 1024 * 1024) {
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  } else if (bytes < 1024 * 1024 * 1024 * 1024) {
    return (bytes / (1024 * 1024 * 1024)).toFixed(2) + ' GB';
  } else {
    return (bytes / (1024 * 1024 * 1024 * 1024)).toFixed(2) + ' TB';
  }
}

function formatETA(etaInSeconds) {
  if (etaInSeconds < 60) {
    return `${etaInSeconds} s`;
  } else if (etaInSeconds < 3600) {
    const minutes = Math.floor(etaInSeconds / 60);
    return `${minutes} min`;
  } else {
    const hours = Math.floor(etaInSeconds / 3600);
    return `${hours} hr`;
  }
}

/**
 * Renders a component to display download progress.
 *
 * @param {Object} props - The component props.
 * @param {number} props.progress - The progress of the download in percentage.
 * @param {string} props.fileName - The name of the file being downloaded.
 * @param {string} props.fileSize - The size of the file being downloaded.
 * @param {number} props.speed - The download speed in MB/s.
 * @param {string} props.eta - The estimated time of arrival for the download to complete.
 * @returns {JSX.Element} The rendered DownloadProgress component.
 */
function DownloadProgress({ progress, fileName, fileSize, downloadFolderPath, speed, eta, cancelDownload, pauseDownload, isPaused, resumeDownload, isResumed }) {

  const [selectedDirectoryPath, setSelectedDirectoryPath] = useState('');

  useEffect(() => {
    window.electron.getSettings().then((settings) => {
      setSelectedDirectoryPath(settings.directoryPath);
    });
  }, []);

  const roundedProgress = Math.round(progress);
  const formattedFileSize = formatFileSize(parseInt(fileSize));
  const formattedETA = formatETA(parseInt(eta));
  const fileIcon = getFileIcon(fileName);

  const downloadedBytes = (progress / 100) * parseInt(fileSize);
  const formattedDownloadedSize = formatFileSize(downloadedBytes);

  const isFinished = roundedProgress === 100;

  const handleOpenFolder = () => {
    window.electron.openPath(selectedDirectoryPath);
  };

  const [isDownloadResumed, setIsDownloadResumed] = useState(false);

  useEffect(() => {
    if (isResumed) {
      setIsDownloadResumed(true);
      console.log('Download resumed');
    }
  }, [isResumed]);

  useEffect(() => {
    if (isPaused) {
      setIsDownloadResumed(false);
      console.log('Download paused');
    }
  }, [isPaused]);

  return (
    <div className="card-body text-start shadow" style={{ borderRadius: '12px', borderTopLeftRadius: '-1px', opacity: '1', borderColor: 'rgb(0,128,255)', marginBottom: '18px' }}>
      <div className="row">
        <div className="col-md-8 col-lg-7">
          {fileIcon}
          <h4 style={{ marginTop: '-28px', paddingRight: '0px', paddingLeft: '0px', marginLeft: '35px', marginRight: '0px' }}>{fileName}</h4>
          <h6 className="text-muted mb-2" style={{ fontSize: '13px' }}>{formattedDownloadedSize} / {formattedFileSize} ({speed} MB/s)</h6>
        </div>
        <div className="col text-end">
          {isFinished ? (
            <button className="btn btn-primary shadow" type="button" style={{ marginRight: '16px', height: '42px', borderRadius: '28px', width: '42px', display: 'inline-flex', justifyContent: 'center', alignItems: 'center' }} onClick={handleOpenFolder}>
              <i className="bi bi-folder" style={{ fontSize: '1.3rem' }}></i>
            </button>
          ) : isPaused ? (
            <button className="btn btn-primary shadow" type="button" style={{ marginRight: '16px', height: '42px', borderRadius: '28px', width: '42px', display: 'inline-flex', justifyContent: 'center', alignItems: 'center' }} onClick={resumeDownload}>
              <i className="bi bi-play-fill" style={{ fontSize: '1.5rem' }}></i>
            </button>
          ) : (
            <button className="btn btn-primary shadow" type="button" style={{ marginRight: '16px', height: '42px', borderRadius: '28px', width: '42px', display: 'inline-flex', justifyContent: 'center', alignItems: 'center' }} onClick={pauseDownload}>
              <i className="bi bi-pause" style={{ fontSize: '1.5rem' }}></i>
            </button>
          )}
          <button className="btn btn-danger shadow" type="button" style={{ borderRadius: '33px', height: '42px', width: '42px', borderColor: 'rgba(255,255,255,0)', display: 'inline-flex', justifyContent: 'center', alignItems: 'center' }} onClick={cancelDownload}>
            <i className="bi bi-x" style={{ fontSize: '1.5rem' }}></i>
          </button>
        </div>
      </div>
      <div className="row">
        <div className="col">
          {isPaused && !isDownloadResumed ? (
            <div className="progress" style={{ borderRadius: '68px' }}>
              <div className="progress-bar bg-warning" role="progressbar" style={{ width: '100%' }} aria-valuenow="100" aria-valuemin="0" aria-valuemax="100">PAUSED</div>
            </div>
          ) : (
            <div className="progress" style={{ borderRadius: '68px' }}>
              <div className={`progress-bar ${roundedProgress === 100 ? 'bg-success' : 'progress-bar-striped progress-bar-animated'}`} aria-valuenow={progress} aria-valuemin="0" aria-valuemax="100" style={{ width: `${progress}%` }}>{roundedProgress}%</div>
            </div>
          )}
        </div>
      </div>

      <h6 className="text-end text-muted card-subtitle mb-2" style={{ fontSize: '13px', marginTop: '6px', marginBottom: '5px', paddingBottom: '0px' }}>ETA {formattedETA}</h6>
    </div>
  );
}

export default DownloadProgress;
