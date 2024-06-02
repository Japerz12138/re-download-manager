import React, { useEffect, useRef, useState } from 'react';
import { EventEmitter } from 'events';
import { Form, Dropdown, Toast, Button, Modal } from 'react-bootstrap';
const { version } = require('../../package.json');


export const settingsChangedEvent = new EventEmitter();

function Settings() {

    const [showSavedToast, setShowSavedToast] = useState(false);
    const [selectedDirectoryPath, setSelectedDirectoryPath] = useState('');
    const [selectedTheme, setSelectedTheme] = useState('Dark');
    const [selectedThreadNumber, setSelectedThreadNumber] = useState('');
    const [selectedSpeedLimit, setSelectedSpeedLimit] = useState(0);
    const [selectedColor, setSelectedColor] = useState('#007bff');
    const [developerInfo, setDeveloperInfo] = useState('');
    const fileInputRef = useRef(null);
    const [downloadPath, setDownloadPath] = useState('');
    const [show, setShow] = useState(false);
    const ColorChangeTimeoutRef = useRef(null);

    const handleShow = () => setShow(true);
    const handleClose = () => setShow(false);

    useEffect(() => {
        window.electron.getSettings().then((settings) => {
            setSelectedDirectoryPath(settings.directoryPath);
            setSelectedTheme(settings.theme);
            setSelectedThreadNumber(settings.threadNumber);
            setSelectedSpeedLimit(settings.speedLimit);
            setSelectedColor(settings.color);
        });

        window.electron.getDownloadPath()
            .then((path) => {
                setDownloadPath(path);
            })
            .catch((error) => {
                console.error("Error getting download path: ", error);
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
        const newColor = event.target.value;
        setSelectedColor(newColor); // Update color when user selects a new color
        document.documentElement.style.setProperty('--main-color', newColor);

        if (ColorChangeTimeoutRef.current) {
            clearTimeout(ColorChangeTimeoutRef.current);
        }

        ColorChangeTimeoutRef.current = setTimeout(() => {
            window.electron.saveSettings({ color: newColor }); // Save new color to settings
            setShowSavedToast(true);
            setTimeout(() => setShowSavedToast(false), 2000);
        }, 500); // Add an 500ms delay to avoid JSON write conflicts
    };

    const resetToDefault = () => {
        const defaultSettings = {
            directoryPath: downloadPath, // default directory path
            theme: 'Follow System', // default theme
            threadNumber: '4', // default thread number
            speedLimit: 0, // default speed limit
            color: '#007bff' // default color
        };

        setSelectedDirectoryPath(defaultSettings.directoryPath);
        window.electron.saveSettings({ directoryPath: defaultSettings.directoryPath });
        settingsChangedEvent.emit('settingsChanged', { setting: 'directoryPath', value: defaultSettings.directoryPath });

        setSelectedTheme(defaultSettings.theme);
        window.electron.saveSettings({ directoryPath: defaultSettings.theme });
        settingsChangedEvent.emit('settingsChanged', { setting: 'theme', value: defaultSettings.theme });

        setSelectedThreadNumber(defaultSettings.threadNumber);
        window.electron.saveSettings({ directoryPath: defaultSettings.threadNumber });
        settingsChangedEvent.emit('settingsChanged', { setting: 'threadNumber', value: defaultSettings.threadNumber });

        setSelectedSpeedLimit(defaultSettings.speedLimit);
        window.electron.saveSettings({ directoryPath: defaultSettings.speedLimit });
        settingsChangedEvent.emit('settingsChanged', { setting: 'speedLimit', value: defaultSettings.speedLimit });

        setSelectedColor(defaultSettings.color);
        document.documentElement.style.setProperty('--main-color', defaultSettings.color);
        window.electron.saveSettings({ directoryPath: defaultSettings.color });

        handleClose();

        window.electron.saveSettings(defaultSettings);
        setShowSavedToast(true);
        setTimeout(() => setShowSavedToast(false), 2000);
    };

    //For debug the oobe screen
    const handleTriggerOobe = () => {
        localStorage.removeItem('oobeShown');
        window.location.reload();
    };

    return (
        <div className="Settings transAnimation">
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
                            <div className="card-body text-start shadow" style={{ borderRadius: '12px', borderTopLeftRadius: '-1px', opacity: '1', borderColor: 'rgb(0,128,255)', marginBottom: '18px' }}>
                                <div className="row">
                                    <div className="col-xl-7">
                                        <h4><i class="bi bi-arrow-clockwise"></i> Reset to Default Settings</h4>
                                        <h6 className="text-muted mb-2" style={{ marginBottom: '-11px', marginTop: '-4px' }}>Reset RDM's settings</h6>
                                    </div>
                                    <div className="col-xl-5" style={{ textAlign: 'right', marginTop: '10px' }}>
                                        <Button onClick={handleShow}><i class="bi bi-arrow-clockwise"></i>  Reset to Default</Button>
                                        <Modal show={show} onHide={handleClose}>
                                            <Modal.Header closeButton>
                                                <Modal.Title><i class="bi bi-exclamation-diamond"></i> Reset Settings</Modal.Title>
                                            </Modal.Header>
                                            <Modal.Body>Are you sure you want to reset the settings?</Modal.Body>
                                            <Modal.Footer>
                                                <Button variant="secondary" onClick={handleClose}>
                                                    Cancel
                                                </Button>
                                                <Button variant="primary" onClick={resetToDefault}>
                                                    <i class="bi bi-arrow-clockwise"></i>  Yes, Reset
                                                </Button>
                                            </Modal.Footer>
                                        </Modal>
                                        {/* For OOBE Debug */}
                                        {/* <Button onClick={handleTriggerOobe} style={{ marginLeft: '10px' }}>Trigger OOBE</Button> */}
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
