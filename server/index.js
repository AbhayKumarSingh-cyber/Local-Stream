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

// Fetch Route - UPDATED
app.get('/api/videos', async (req, res) => {
  try {
    // Attempting to fetch videos from the specified folder
    const result = await cloudinary.api.resources({
      type: 'upload',
      prefix: 'local-stream-vault/', // Ensure this matches your Cloudinary folder exactly
      resource_type: 'video',
      max_results: 50 // Increased to ensure we fetch enough items
    });
    
    // Log the result to your Render dashboard logs to debug why videos aren't showing
    console.log("Cloudinary fetch result:", result.resources); 
    
    res.json(result.resources);
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