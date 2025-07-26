import React from 'react';
import DownloadComponent from './DownloadComponent';
import EmptyState from './EmptyState';

function DownloadList({ urls, pausedDownloads, removeUrl }) {
  const hasDownloads = urls.length > 0 || pausedDownloads.length > 0;

  return (
    <div className="card" style={{ borderStyle: 'none' }}>
      {!hasDownloads && <EmptyState />}
      {urls.map((url) => (
        <DownloadComponent key={url} url={url} removeUrl={removeUrl} />
      ))}
      {pausedDownloads.map(download => (
        <DownloadComponent 
          key={download.id} 
          url={download.url} 
          initialState={download} 
          removeUrl={removeUrl} 
        />
      ))}
    </div>
  );
}

export default DownloadList; 