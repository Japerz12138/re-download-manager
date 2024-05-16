import React, { useEffect, useRef, useState } from 'react';
import { EventEmitter } from 'events';
import { Form, Dropdown, Toast } from 'react-bootstrap';
const { version } = require('../../package.json');

export const settingsChangedEvent = new EventEmitter();

function Settings() {

    const [showSavedToast, setShowSavedToast] = useState(false);
    const [selectedDirectoryPath, setSelectedDirectoryPath] = useState('');
    const [selectedTheme, setSelectedTheme] = useState('Dark');
    const [selectedThreadNumber, setSelectedThreadNumber] = useState('');
    const [selectedSpeedLimit, setSelectedSpeedLimit] = useState(0);
    const [selectedColor, setSelectedColor] = useState('#007bff');
    const fileInputRef = useRef(null);
    const [developerInfo, setDeveloperInfo] = useState('');

    useEffect(() => {
        window.electron.getSettings().then((settings) => {
            setSelectedDirectoryPath(settings.directoryPath);
            setSelectedTheme(settings.theme);
            setSelectedThreadNumber(settings.threadNumber);
            setSelectedSpeedLimit(settings.speedLimit);
            setSelectedColor(settings.color);
        });
    }, []);

    useEffect(() => {
        setDeveloperInfo('Developed by Team RDM');
    }, []);

    const handleDirectoryChange = (event) => {
        const files = event.target.files;
        if (files.length > 0) {
            const selectedDirectory = files[0];
            const path = selectedDirectory.path.split(selectedDirectory.name)[0];
            setSelectedDirectoryPath(path);
            console.log(selectedDirectory.path);
            window.electron.saveSettings({ directoryPath: path });
            setShowSavedToast(true);
            setTimeout(() => setShowSavedToast(false), 2000);
            settingsChangedEvent.emit('settingsChanged', { setting: 'directoryPath', value: path });
        }
    };

    const openDirectorySelector = (event) => {
        event.preventDefault();
        fileInputRef.current.click();
    };

    const handleThemeChange = (theme) => {
        setSelectedTheme(theme);
        window.electron.saveSettings({ theme: theme });
        setShowSavedToast(true);
        setTimeout(() => setShowSavedToast(false), 2000);

        if (theme === 'Dark') {
            const htmlElement = document.querySelector('html');
            htmlElement.setAttribute('data-bs-theme', 'dark');
        } else {
            const htmlElement = document.querySelector('html');
            htmlElement.setAttribute('data-bs-theme', 'light');
        }

        settingsChangedEvent.emit('settingsChanged', { setting: 'theme', value: theme });
    };

    const handleThreadNumberChange = (number) => {
        setSelectedThreadNumber(number);
        window.electron.saveSettings({ threadNumber: number });
        setShowSavedToast(true);
        setTimeout(() => setShowSavedToast(false), 2000);
        settingsChangedEvent.emit('settingsChanged', { setting: 'threadNumber', value: number });
    };

    const handleSpeedLimitChange = (event) => {
        const speedLimit = event.target.value;
        setSelectedSpeedLimit(speedLimit);
        window.electron.saveSettings({ speedLimit: speedLimit });
        setShowSavedToast(true);
        setTimeout(() => setShowSavedToast(false), 2000);
        settingsChangedEvent.emit('settingsChanged', { setting: 'speedLimit', value: speedLimit });
    };

    const handleColorChange = (event) => {
        setSelectedColor(event.target.value); // Update color when user selects a new color
        window.electron.saveSettings({ color: event.target.value }); // Save new color to settings
        setShowSavedToast(true);
        setTimeout(() => setShowSavedToast(false), 2000);
        document.documentElement.style.setProperty('--main-color', event.target.value);
    };

    return (
        <div className="Settings">
            <Toast show={showSavedToast} onClose={() => setShowSavedToast(false)} style={{ position: 'fixed', top: '0', right: '0', margin: '1rem', zIndex: '10000' }}>
                <Toast.Body className="text-center"><i class="bi bi-floppy"></i>  Setting has been saved</Toast.Body>
            </Toast>
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
                                        <h4><i class="bi bi-palette"></i> Color</h4>
                                        <h6 className="text-muted mb-2" style={{ marginBottom: '-11px', marginTop: '-4px' }}>Change the color of RDM</h6>
                                    </div>
                                    <div className="col-xl-5" style={{ textAlign: 'right', marginTop: '10px' }}>
                                        <Form.Group controlId="formColorPicker" className="d-flex justify-content-end">
                                            <Form.Control type="color" value={selectedColor} onChange={handleColorChange} />
                                        </Form.Group>
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
                                        <input
                                            class="form-control"
                                            type="text"
                                            style={{ paddingLeft: '0px', textAlign: 'right' }}
                                            placeholder="0"
                                            value={selectedSpeedLimit}
                                            onChange={handleSpeedLimitChange}
                                        />
                                        <small style={{ marginLeft: '10px' }}>KB/s</small>
                                    </div>
                                </div>
                            </div>
                            <div className="card-body text-start shadow" style={{ borderRadius: '12px', borderTopLeftRadius: '-1px', opacity: '1', borderColor: 'rgb(0,128,255)', marginBottom: '18px' }}>
                                <div className="row">
                                    <div className="col-xl-7">
                                        <h4><i className="bi bi-info-circle"></i> App Info</h4>
                                        <h6 className="text-muted mb-2" style={{ marginBottom: '-11px', marginTop: '-4px' }}>Versions and Information</h6>
                                    </div>
                                    <div className="col-xl-5" style={{ textAlign: 'right', marginTop: '10px' }}>
                                        <p>RDM Version: {version}</p>
                                        <p>{developerInfo}</p>
                                        <a href="https://github.com/Japerz12138/re-download-manager" target="_blank" rel="noopener noreferrer">
                                            <img src="https://img.shields.io/github/stars/Japerz12138/re-download-manager?style=social" alt="Github Badge" />
                                        </a>
                                    </div>
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
