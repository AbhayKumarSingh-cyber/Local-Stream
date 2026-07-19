import React, { useState } from 'react';

export default function VideoUpload({ onUploadComplete }: { onUploadComplete?: () => void }) {
  const [status, setStatus] = useState('');

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const chunkSize = 1024 * 1024;
    const totalChunks = Math.ceil(file.size / chunkSize);
    const fileName = file.name;

    setStatus('Uploading...');

    for (let i = 0; i < totalChunks; i++) {
      const start = i * chunkSize;
      const end = Math.min(start + chunkSize, file.size);
      const chunk = file.slice(start, end);

      try {
        const url = `http://localhost:5000/upload-chunk?chunkNumber=${i}&totalChunks=${totalChunks}&fileName=${encodeURIComponent(fileName)}`;
        const response = await fetch(url, {
          method: 'POST',
          body: chunk,
          headers: { 'Content-Type': 'application/octet-stream' }
        });

        if (!response.ok) {
          throw new Error(`Failed at chunk ${i}`);
        }
        
        const progress = Math.round(((i + 1) / totalChunks) * 100);
        setStatus(`Uploading: ${progress}%`);
      } catch (err) {
        setStatus('Pipeline broken. (0%)');
        console.error(err);
        return;
      }
    }
    setStatus('Upload Complete!');
    onUploadComplete?.();
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <p>{status}</p>
    </div>
  );
}
