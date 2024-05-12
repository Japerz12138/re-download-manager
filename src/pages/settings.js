import React, { useEffect, useRef, useState } from 'react';
import { Dropdown } from 'react-bootstrap';
const { version } = require('../../package.json');

function Settings() {

    const [selectedDirectoryPath, setSelectedDirectoryPath] = useState('');
    const [selectedTheme, setSelectedTheme] = useState('Dark');
    const [selectedThreadNumber, setSelectedThreadNumber] = useState('');
    const fileInputRef = useRef(null);

    useEffect(() => {
        window.electron.getSettings().then((settings) => {
            setSelectedDirectoryPath(settings.directoryPath);
            setSelectedTheme(settings.theme);
            setSelectedThreadNumber(settings.threadNumber);
        });
    }, []);

    const handleDirectoryChange = (event) => {
        const files = event.target.files;
        if (files.length > 0) {
            const selectedDirectory = files[0];
            const path = selectedDirectory.path.split(selectedDirectory.name)[0];
            setSelectedDirectoryPath(path);
            console.log(selectedDirectory.path);
            window.electron.saveSettings({ directoryPath: path });
        }
    };

    const openDirectorySelector = (event) => {
        event.preventDefault();
        fileInputRef.current.click();
    };

    const handleThemeChange = (theme) => {
        setSelectedTheme(theme);
        window.electron.saveSettings({ theme: theme });

        if (theme === 'Dark') {
            const htmlElement = document.querySelector('html');
            htmlElement.setAttribute('data-bs-theme', 'dark');
          } else {
            const htmlElement = document.querySelector('html');
            htmlElement.setAttribute('data-bs-theme', 'light');
          }
    };

    const handleThreadNumberChange = (number) => {
        setSelectedThreadNumber(number);
        window.electron.saveSettings({ threadNumber: number });
    };

    return (
        <div className="Settings">
            <div className="container" style={{ marginTop: '100px' }}>
                <div className="row">
                    <div className="col">
                        <div className="card" style={{ borderStyle: 'none' }}>
                            <h1>Settings</h1>
                            <div className="card-body text-start shadow" style={{ borderRadius: '12px', borderTopLeftRadius: '-1px', opacity: '1', borderColor: 'rgb(0,128,255)', marginBottom: '18px' }}>
                                <div className="row">
                                    <div className="col-xl-7">
                                        <h4><i class="bi bi-folder"></i> Download Location</h4>
                                        <h6 className="text-muted mb-2" style={{ marginBottom: '-11px', marginTop: '-4px' }}>Choose your download directory</h6>
                                    </div>
                                    <div className="col-xl-5" style={{ textAlign: 'right', marginTop: '10px' }}>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={selectedDirectoryPath}
                                            readOnly
                                            style={{ marginRight: '5px' }}
                                        />
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            className="form-control"
                                            style={{ display: 'none' }}
                                            directory=""
                                            webkitdirectory=""
                                            onChange={handleDirectoryChange}
                                        />
                                        <button
                                            className="btn btn-primary"
                                            type="button"
                                            onClick={openDirectorySelector}
                                            style={{ marginTop: '5px' }}
                                        >
                                            Select Directory
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="card-body text-start shadow" style={{ borderRadius: '12px', borderTopLeftRadius: '-1px', opacity: '1', borderColor: 'rgb(0,128,255)', marginBottom: '18px' }}>
                                <div className="row">
                                    <div className="col-xl-7">
                                        <h4><i className="bi bi-stars"></i> Theme</h4>
                                        <h6 className="text-muted mb-2" style={{ marginBottom: '-11px', marginTop: '-4px' }}>Change between dark mode, light mode or follow system settings.</h6>
                                    </div>
                                    <div className="col-xl-5" style={{ textAlign: 'right', marginTop: '10px' }}>
                                        <Dropdown>
                                            <Dropdown.Toggle variant="primary" id="themeDropdown">
                                                {selectedTheme}
                                            </Dropdown.Toggle>

                                            <Dropdown.Menu>
                                                <Dropdown.Item onClick={() => handleThemeChange('Follow System')}>Follow System</Dropdown.Item>
                                                <Dropdown.Item onClick={() => handleThemeChange('Light')}>Light</Dropdown.Item>
                                                <Dropdown.Item onClick={() => handleThemeChange('Dark')}>Dark</Dropdown.Item>
                                            </Dropdown.Menu>
                                        </Dropdown>
                                    </div>
                                </div>
                            </div>
                            <div className="card-body text-start shadow" style={{ borderRadius: '12px', borderTopLeftRadius: '-1px', opacity: '1', borderColor: 'rgb(0,128,255)', marginBottom: '18px' }}>
                                <div className="row">
                                    <div className="col-xl-7">
                                        <h4><i className="bi bi-copy"></i> Download Thread</h4>
                                        <h6 className="text-muted mb-2" style={{ marginBottom: '-11px', marginTop: '-4px' }}>Select the number of shards you want to split. Increasing threads may speed up downloads, or it may slow down your computer.</h6>
                                    </div>
                                    <div className="col-xl-5" style={{ textAlign: 'right', marginTop: '10px' }}>
                                        <Dropdown>
                                            <Dropdown.Toggle variant="primary" id="threadDropdown">
                                                {selectedThreadNumber}
                                            </Dropdown.Toggle>

                                            <Dropdown.Menu>
                                                {/* <Dropdown.Item onClick={() => handleThreadNumberChange('Let System Decide')}>Let System Decide</Dropdown.Item> */}
                                                <Dropdown.Item onClick={() => handleThreadNumberChange('2')}>2</Dropdown.Item>
                                                <Dropdown.Item onClick={() => handleThreadNumberChange('4')}>4</Dropdown.Item>
                                                <Dropdown.Item onClick={() => handleThreadNumberChange('6')}>6</Dropdown.Item>
                                                <Dropdown.Item onClick={() => handleThreadNumberChange('8')}>8</Dropdown.Item>
                                                <Dropdown.Item onClick={() => handleThreadNumberChange('16')}>16</Dropdown.Item>
                                                <Dropdown.Item onClick={() => handleThreadNumberChange('32')}>32</Dropdown.Item>
                                            </Dropdown.Menu>
                                        </Dropdown>
                                    </div>
                                </div>
                            </div>
                            <div className="card-body text-start shadow" style={{ borderRadius: '12px', borderTopLeftRadius: '-1px', opacity: '1', borderColor: 'rgb(0,128,255)', marginBottom: '18px' }}>
                                <div className="row">
                                    <div className="col-xl-7">
                                        <h4><i className="bi bi-speedometer"></i> Speed Limit</h4>
                                        <h6 className="text-muted mb-2" style={{ marginBottom: '-11px', marginTop: '-4px' }}>Limit the download speed of individual files. (Set "0" to disable this function)</h6>
                                    </div>
                                    <div className="col-xl-5" style={{ textAlign: 'right', marginTop: '10px' }}>
                                        <input class="form-control" type="text" style={{ paddingLeft: '0px', textAlign: 'right' }} placeholder="0" /><small style={{ marginLeft: '10px' }}>KB/s</small>
                                    </div>
                                </div>
                            </div>
                            <p>RDM Version: {version}</p>
                            <div className="row text-center">
                                <div className="col">
                                    <button className="btn btn-primary" type="button"><i className="bi bi-save-fill"></i> Save</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <script src="assets/bootstrap/js/bootstrap.bundle.min.js"></script>
        </div>
    );
}

export default Settings;
