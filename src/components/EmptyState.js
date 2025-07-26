import React from 'react';

function EmptyState() {
  return (
    <div>
      <i className="bi bi-dropbox" style={{ fontSize: '2rem', color: 'grey' }}></i>
      <p className="fs-5 text-muted text-uppercase">Nothing Here</p>
      <p className="text-muted">Press + to start a download</p>
    </div>
  );
}

export default EmptyState; 