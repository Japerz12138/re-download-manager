import React, { useEffect, useRef, useState  } from 'react';

function Settings() {

    const [selectedDirectoryPath, setSelectedDirectoryPath] = useState('');
    const fileInputRef = useRef(null);

    const handleDirectoryChange = (event) => {
        const files = event.target.files;
        if (files.length > 0) {
            const selectedDirectory = files[0];
            setSelectedDirectoryPath(selectedDirectory.path.split(selectedDirectory.name)[0]);
            console.log(selectedDirectory.path);
        }
    };

    const openDirectorySelector = (event) => {
        event.preventDefault();
        fileInputRef.current.click();
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
                                        <div className="dropdown">
                                            <button className="btn btn-primary dropdown-toggle" type="button" id="themeDropdown" data-bs-toggle="dropdown" aria-expanded="false" style={{ textAlign: 'right', marginRight: '25px' }}>
                                                Follow System
                                            </button>
                                            <ul className="dropdown-menu" aria-labelledby="themeDropdown">
                                                <li><a className="dropdown-item" href="#">Follow System</a></li>
                                                <li><a className="dropdown-item" href="#">Light</a></li>
                                                <li><a className="dropdown-item" href="#">Dark</a></li>
                                            </ul>
                                        </div>
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
                                        <div className="dropdown">
                                            <button className="btn btn-primary dropdown-toggle" type="button" id="threadDropdown" data-bs-toggle="dropdown" aria-expanded="false" style={{ textAlign: 'right', marginRight: '25px' }}>
                                                Let System Decide
                                            </button>
                                            <ul className="dropdown-menu" aria-labelledby="threadDropdown">
                                                <li><a className="dropdown-item" href="#">Let System Decide</a></li>
                                                <li><a className="dropdown-item" href="#">2</a></li>
                                                <li><a className="dropdown-item" href="#">4</a></li>
                                                <li><a className="dropdown-item" href="#">8</a></li>
                                                <li><a className="dropdown-item" href="#">16</a></li>
                                                <li><a className="dropdown-item" href="#">32</a></li>
                                            </ul>
                                        </div>
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
