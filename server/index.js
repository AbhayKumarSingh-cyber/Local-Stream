import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();

cloudinary.config({ 
  cloud_name: 'jzqifbhx', 
  api_key: '629336954571766', 
  api_secret: 'TQs1xFnEDQZpPIOeZkURjmKYxV8'
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const upload = multer({ storage: multer.memoryStorage() });

// Upload Route
app.post('/api/upload', upload.single('video'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file' });
    const b64 = Buffer.from(req.file.buffer).toString("base64");
    const dataURI = "data:" + req.file.mimetype + ";base64," + b64;
    const result = await cloudinary.uploader.upload(dataURI, {
      resource_type: "video",
      folder: "local-stream-vault"
    });
    res.status(200).json({ url: result.secure_url });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Fetch Route - Flexible and Error-Resilient
app.get('/api/videos', async (req, res) => {
  try {
    // Fetch all video resources without a strict prefix restriction
    const result = await cloudinary.api.resources({
      type: 'upload',
      resource_type: 'video',
      max_results: 50
    });
    
    // Filter locally in memory to find matching assets
    const filteredVideos = result.resources.filter(file => 
      file.public_id && file.public_id.includes('local-stream-vault')
    );
    
    // Fallback to all resources if the local filter returns nothing but assets exist
    const videosToSend = filteredVideos.length > 0 ? filteredVideos : result.resources;

    console.log("Cloudinary fetch result count:", videosToSend.length); 
    res.json(videosToSend);
  } catch (error) {
    console.error("Cloudinary Error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Production Static Files
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist', 'index.html'));
  });
}

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));