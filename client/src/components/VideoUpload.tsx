import React, { useState } from 'react';

export default function VideoUpload({ onUploadComplete }: { onUploadComplete?: () => void }) {
  const [status, setStatus] = useState('');

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setStatus('Uploading...');

    const formData = new FormData();
    formData.append('video', file);

    try {
      // Use relative path so it works seamlessly on both local and Render production
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed on server');
      }

      setStatus('Upload Complete!');
      onUploadComplete?.();
    } catch (err) {
      setStatus('Pipeline broken. (0%)');
      console.error(err);
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <p>{status}</p>
    </div>
  );
}