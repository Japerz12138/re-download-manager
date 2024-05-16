import React, { useState, useEffect } from 'react';


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

function History() {
    const [history, setHistory] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        async function fetchHistory() {
            const history = await window.electron.getHistory();
            setHistory(history);
        }
        fetchHistory();
    }, []);

    const totalPages = Math.ceil(history.length / itemsPerPage);

    /* the history object looks like this:
    [
        {
            "id": 1715897535900,
            "url": "http://link.testfile.org/150MB",
            "fileName": "150MB",
            "fileSize": 157286400,
            "dateTime": "2024-05-16T22:12:23.878Z",
            "numShards": "4",
            "finalFilePath": "C:\\Users\\Ethan B\\Downloads\\150MB"
        }
    ]
   */

    const currentItems = history.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    return (
        <div className='History'>
            <div className="container" style={{ marginTop: '100px' }}>
                <button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>Previous</button>
                <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)}>Next</button>
                <div className="row">
                    {currentItems.length > 0 ? currentItems.map((item, index) => (
                        <div key={index} className="col">
                            <div className="card-body text-start shadow" style={{ borderRadius: '12px', borderTopLeftRadius: '-1px', opacity: '1', borderColor: 'rgb(0,128,255)', marginBottom: '18px' }}>
                                <div className="row">
                                    <div className="col-md-8 col-lg-7">
                                        <h4 style={{ marginTop: '-28px', paddingRight: '0px', paddingLeft: '0px', marginLeft: '35px', marginRight: '0px' }}>{item.fileName}</h4>
                                        <h6 className="text-muted mb-2" style={{ fontSize: '13px' }}>{formatFileSize(item.fileSize)}</h6>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col">
                                        <p>URL: {item.url}</p>
                                        <p>Date Time: {item.dateTime}</p>
                                        <p>Number of Shards: {item.numShards}</p>
                                        <p>Final File Path: {item.finalFilePath}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )) : (
                        <div className="col">
                            <div className="card" style={{ borderStyle: 'none' }}>
                                <div>
                                    <i className="bi bi-dropbox" style={{ fontSize: '2rem', color: 'grey' }}></i>
                                    <p className="fs-5 text-muted text-uppercase">No History Found</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                <button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>Previous</button>
                <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)}>Next</button>
            </div>
        </div>
    );
}

export default History;