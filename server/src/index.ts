import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { handleChunkUpload } from './uploadHandler.js';

const app = express();
const PORT = process.env.PORT || 5000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const storagePath = path.join(__dirname, '../storage');

app.use(cors());
app.use(express.json());

// Both routes now point to your actual storage folder
app.use('/videos', express.static(storagePath));
app.use('/uploads', express.static(storagePath));

app.get('/api/videos', (req, res) => {
  fs.readdir(storagePath, (err, files) => {
    if (err) return res.status(500).json({ error: 'Failed to scan storage' });
    
    const mp4Files = files.filter(file => file.endsWith('.mp4') && !file.includes('_480p'));
    
    const sortedFiles = mp4Files
      .map(file => ({
        name: file,
        time: fs.statSync(path.join(storagePath, file)).mtime.getTime()
      }))
      .sort((a, b) => a.time - b.time)
      .map(fileObj => fileObj.name);

    res.json(sortedFiles);
  });
});

app.post('/upload-chunk', handleChunkUpload);

app.listen(PORT, () => {
  console.log(`🚀 Transcoder server active on http://localhost:${PORT}`);
});