import React, { useState } from 'react';

//depreciated, keeping for testing and reference but do not use for production - ethan

function DownloadButton() {
  const [progress, setProgress] = useState([0, 0, 0, 0]);

  const startDownload = () => {
    const url = 'https://api.japerz.com/documents/OBS-Studio-30.1.1-Full-Installer-x64.exe';
    window.electron.startDownload(url);
  };

  window.electron.onDownloadProgress((shardIndex, percentCompleted) => {
    setProgress(prevProgress => {
      const newProgress = [...prevProgress];
      newProgress[shardIndex] = percentCompleted;
      return newProgress;
    });
  });

  return (
    <div>
      <button onClick={startDownload}>Start Download</button>
      <div>
        {progress.map((percentCompleted, i) => (
          <div key={i}>Shard {i}: {percentCompleted}%</div>
        ))}
      </div>
    </div>
  );
}

export default DownloadButton;