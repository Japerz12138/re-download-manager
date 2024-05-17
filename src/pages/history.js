import React, { useState, useEffect } from 'react';
import { Button, Toast, Modal } from 'react-bootstrap';
import '../App.css'; // Assuming you have a separate CSS file for styling

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
            return <i className="bi bi-file-earmark-image" style={{ fontSize: '1.5rem' }}></i>;
        case 'pdf':
            return <i className="bi bi-file-earmark-pdf" style={{ fontSize: '1.5rem' }}></i>;
        case 'exe':
            return <i className="bi bi-filetype-exe" style={{ fontSize: '1.5rem' }}></i>;
        default:
            return <i className="bi bi-file-earmark" style={{ fontSize: '1.5rem' }}></i>;
    }
}

function formatDateTime(dateTime) {
    const date = new Date(dateTime);
    const options = { month: 'long', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true };
    return date.toLocaleDateString('en-US', options);
}

function History() {
    const [history, setHistory] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [showClearToast, setShowClearToast] = useState(false);
    const [show, setShow] = useState(false);
    const itemsPerPage = 10;

    const handleShow = () => setShow(true);
    const handleClose = () => setShow(false);

    function handleClearHistory() {
        window.electron.clearHistory();
        handleClose();
        setShowClearToast(true);
        setTimeout(() => setShowClearToast(false), 2000);
    };


    function handleOpenFolder() { };

    function handleDelete() { };

    useEffect(() => {
        async function fetchHistory() {
            const history = await window.electron.getHistory();
            setHistory(history);
        }
        fetchHistory();
    }, []);

    const totalPages = Math.ceil(history.length / itemsPerPage);
    const currentItems = history.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    return (
        <div className='History transAnimation'>
            <Toast show={showClearToast} onClose={() => setShowClearToast(false)} style={{ position: 'fixed', top: '0', right: '0', margin: '1rem', zIndex: '10000' }}>
                <Toast.Body className="text-center"><i class="bi bi-trash"></i> History Cleared</Toast.Body>
            </Toast>
            <div className="container" style={{ marginTop: '100px' }}>
                <div className="row">
                    <div className="col">
                        <div className="card" style={{ borderStyle: 'none' }}>
                            {currentItems.length > 0 ? currentItems.map((item, index) => (
                                <div key={index} className="card-body text-start shadow" style={{ borderRadius: '12px', borderTopLeftRadius: '-1px', opacity: '1', borderColor: 'rgb(0,128,255)', marginBottom: '18px' }}>
                                    <div className="row">
                                        <div className="col-md-8 col-lg-7">
                                            {getFileIcon(item.fileName)}
                                            <h4 style={{ marginTop: '-28px', paddingRight: '0px', paddingLeft: '0px', marginLeft: '35px', marginRight: '0px' }}>{item.fileName}</h4>
                                            <h6 className="text-muted mb-2" style={{ fontSize: '13px' }}>{formatDateTime(item.dateTime)} - {formatFileSize(item.fileSize)}</h6>
                                            <h6 className="text-muted mb-2" style={{ fontSize: '13px' }}><i className="bi bi-folder2"></i>  {item.finalFilePath}</h6>
                                            <h6 className="text-muted mb-2" style={{ fontSize: '13px' }}><i className="bi bi-link-45deg"></i>  {item.url}</h6>
                                        </div>
                                        <div className="col text-end">
                                            <button className="btn btn-primary shadow" type="button" style={{ marginRight: '16px', height: '42px', borderRadius: '28px', width: '42px', display: 'inline-flex', justifyContent: 'center', alignItems: 'center' }} onClick={handleOpenFolder}>
                                                <i className="bi bi-folder" style={{ fontSize: '1.3rem' }}></i>
                                            </button>
                                            <button className="btn btn-danger shadow" type="button" style={{ borderRadius: '33px', height: '42px', width: '42px', borderColor: 'rgba(255,255,255,0)', display: 'inline-flex', justifyContent: 'center', alignItems: 'center' }} onClick={handleDelete}>
                                                <i className="bi bi-x" style={{ fontSize: '1.5rem' }}></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )) : (
                                <div className="text-center">
                                    <i className="bi bi-dropbox" style={{ fontSize: '2rem', color: 'grey' }}></i>
                                    <p className="fs-5 text-muted text-uppercase">No History Found</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <div className="d-flex justify-content-between" style={{ marginTop: '10px' }}>
                    <Button className="btn btn-danger" type="button" onClick={handleShow}><i class="bi bi-trash"></i>  Clear</Button>
                    <Modal show={show} onHide={handleClose}>
                        <Modal.Header closeButton>
                            <Modal.Title><i class="bi bi-exclamation-diamond"></i> Clear History</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>Are you sure you want to clear the history?</Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleClose}>
                                Cancel
                            </Button>
                            <Button variant="primary" onClick={handleClearHistory}>
                                <i class="bi bi-trash"></i>  Yes
                            </Button>
                        </Modal.Footer>
                    </Modal>
                    <div>
                        <Button className="btn btn-primary mr-2" type="button" disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)} style={{ marginRight: '10px' }}><i class="bi bi-chevron-left"></i>  Previous</Button>
                        <Button className="btn btn-primary" type="button" disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)}>Next  <i class="bi bi-chevron-right"></i></Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default History;
