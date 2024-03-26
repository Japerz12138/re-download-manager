import React, { useState } from 'react';
import './App.css';
import Navbar from './Navbar';
import DownloadComponent from './components/DownloadComponent';

/**
 * Main application component.
 * @returns {JSX.Element} The rendered App component.
 */
function App() {
  const [urls, setUrls] = useState([]);

  /**
   * Handles the keydown event on the input field.
   * If the Enter key is pressed, adds the entered URL to the list of URLs.
   * @param {React.KeyboardEvent<HTMLInputElement>} event - The keydown event.
   */
  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      const newUrl = event.target.value;
      setUrls(prevUrls => prevUrls.includes(newUrl) ? prevUrls : [...prevUrls, newUrl]);
      event.target.value = '';
    }
  };

  return (
    <div className="App">
      <Navbar />
      <div className="container-fluid">
        <div className="row">
          <div className="col">
            <div className="card shadow-lg o-hidden border-0 my-5">
              <div className="card-body p-0">
                <div className="row">
                  <div className="col-lg-7">
                    <div className="p-5">
                      <input type="text" onKeyDown={handleKeyDown} placeholder="Enter download URL" />
                      {urls.map((url) => <DownloadComponent key={url} url={url} />)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
