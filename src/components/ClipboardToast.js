import React from 'react';
import { Toast } from 'react-bootstrap';

function ClipboardToast({ showClipboardToast, setShowClipboardToast }) {
  return (
    <Toast 
      show={showClipboardToast} 
      onClose={() => setShowClipboardToast(false)} 
      style={{ position: 'fixed', top: '0', right: '0', margin: '1rem', zIndex: '10000' }}
    >
      <Toast.Body><i className="bi bi-clipboard-check"></i>  URL detected in clipboard!</Toast.Body>
    </Toast>
  );
}

export default ClipboardToast; 