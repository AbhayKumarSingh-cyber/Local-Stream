import React, { useState } from 'react';
import RefreshIcon from '@mui/icons-material/Refresh';
import UploadFileIcon from '@mui/icons-material/UploadFile';

export default function UploadPortal({ onUploadComplete }: { onUploadComplete: () => void }) {
  const [status, setStatus] = useState('');

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // ... (rest of your existing logic remains the same)
    setStatus('Upload Complete!');
    onUploadComplete();
  };

  return (
    <div style={{ padding: '20px', background: '#222', borderRadius: '8px', color: '#fff' }}>
      <h3>Upload Portal</h3>
      <button onClick={() => document.getElementById('fileInput')?.click()}>
        <UploadFileIcon /> Upload
      </button>
      <input id="fileInput" type="file" style={{ display: 'none' }} onChange={handleFileChange} />
      <button onClick={() => window.location.reload()}>
        <RefreshIcon /> Refresh Player
      </button>
      <p>{status}</p>
    </div>
  );
}
