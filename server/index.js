import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';

// 1. Setup __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 2. Initialize App
const app = express();

// 3. Configure Cloudinary (Automatically uses your CLOUDINARY_URL from Render)
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({ 
  cloud_name: 'jzqifbhx', 
  api_key: '629336954571766', 
  api_secret: 'PASTE_YOUR_SECRET_HERE' 
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Multer setup (to temporarily handle the file in memory)
const upload = multer({ storage: multer.memoryStorage() });

// 4. THE UPLOAD ROUTE
// This replaces your local file-saving logic
app.post('/api/upload', upload.single('video'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Convert buffer to base64 for Cloudinary
    const b64 = Buffer.from(req.file.buffer).toString("base64");
    const dataURI = "data:" + req.file.mimetype + ";base64," + b64;

    const result = await cloudinary.uploader.upload(dataURI, {
      resource_type: "video",
      folder: "local-stream-vault" // Optional: organizes your files in Cloudinary
    });

    res.status(200).json({ url: result.secure_url });
  } catch (error) {
    console.error("Cloudinary Upload Error:", error);
    res.status(500).json({ message: "Upload failed", error });
  }
});

// 5. Serve static files (Client)
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/dist')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist', 'index.html'));
  });
}

// 6. Listen
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
