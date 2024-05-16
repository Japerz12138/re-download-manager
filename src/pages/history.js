import React, { useState, useEffect } from 'react';

function History() {
    return (
        <div className='History transAnimation'>
            <div className="container" style={{ marginTop: '100px' }}>
                <div className="row">
                    <div className="col">
                        <div className="card" style={{ borderStyle: 'none' }}>
                            <div>
                                <i className="bi bi-dropbox" style={{ fontSize: '2rem', color: 'grey' }}></i>
                                <p className="fs-5 text-muted text-uppercase">No History Found</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default History;