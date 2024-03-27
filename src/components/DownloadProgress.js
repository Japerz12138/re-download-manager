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
import React from 'react';

function getFileIcon(fileName) {
  const lastDotIndex = fileName.lastIndexOf('.');
  if (lastDotIndex === -1) {
    return <i className="bi bi-file-earmark"></i>; // No file extension found
  }
  const extension = fileName.substring(lastDotIndex + 1).toLowerCase(); // Get the file extension
  switch (extension) {
    case 'png':
    case 'jpg':
    case 'jpeg':
      return <i className="bi bi-file-earmark-image"></i>; // Bootstrap icon for image files
    case 'pdf':
      return <i className="bi bi-file-earmark-pdf"></i>; // Bootstrap icon for PDF files
    case 'exe':
      return <i className="bi bi-filetype-exe"></i>; // Bootstrap icon for executable files
    default:
      return <i className="bi bi-file-earmark"></i>; // Default icon if no match is found
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

function DownloadProgress({ progress, fileName, fileSize, speed, eta }) {
  const roundedProgress = Math.round(progress);
  const formattedFileSize = formatFileSize(parseInt(fileSize));
  const fileIcon = getFileIcon(fileName);

  return (
    <div className="card-body text-start shadow" style={{ borderRadius: '12px', borderTopLeftRadius: '-1px', opacity: '1', borderColor: 'rgb(0,128,255)', marginBottom: '18px' }}>
      <div className="row">
        <div className="col-md-8 col-lg-7">
        {fileIcon}
          <h4 style={{ marginTop: '-28px', paddingRight: '0px', paddingLeft: '0px', marginLeft: '35px', marginRight: '0px' }}>{fileName}</h4>
          <h6 className="text-muted mb-2" style={{ fontSize: '13px' }}>{formattedFileSize} ({speed} MB/s)</h6>
        </div>
        <div className="col text-end">
          <button className="btn btn-primary shadow" type="button" style={{ marginRight: '16px', height: '42px', borderRadius: '28px', width: '42px' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 16 16" className="bi bi-pause-fill text-center" style={{ fontSize: '25px', marginLeft: '-5px' }}>
              <path d="M5.5 3.5A1.5 1.5 0 0 1 7 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5m5 0A1.5 1.5 0 0 1 12 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5"></path>
            </svg>
          </button>
          <button className="btn btn-danger shadow" type="button" style={{ borderRadius: '33px', height: '42px', width: '42px', borderColor: 'rgba(255,255,255,0)' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 16 16" className="bi bi-x" style={{ fontSize: '25px', marginLeft: '-4px' }}>
              <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"></path>
            </svg>
          </button>
        </div>
      </div>
      <div className="row">
        <div className="col">
          <div className="progress" style={{ borderRadius: '68px' }}>
            <div className="progress-bar progress-bar-striped progress-bar-animated" aria-valuenow={progress} aria-valuemin="0" aria-valuemax="100" style={{ width: `${progress}%` }}>{roundedProgress}%</div>
          </div>
        </div>
      </div>
      <h6 className="text-end text-muted card-subtitle mb-2" style={{ fontSize: '13px', marginTop: '6px', marginBottom: '5px', paddingBottom: '0px' }}>ETA {eta}</h6>
    </div>
  );
}

export default DownloadProgress;