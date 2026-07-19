import { useState, useEffect } from 'react';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';

export default function VideoPlayer() {
  const [videoSrc, setVideoSrc] = useState('');
  const [resolution, setResolution] = useState('original');

  const refreshPlayer = async () => {
    try {
      // 1. Fetching from the relative path (works on both local and Render)
      const response = await fetch('/api/videos');
      const files = await response.json();
      
      if (files && files.length > 0) {
        // 2. Accessing the latest file object from the Cloudinary API array
        const latestFile = files[files.length - 1];
        
        // 3. Using secure_url from the Cloudinary object
        let videoUrl = latestFile.secure_url;

        // 4. Handling resolution (Basic transformation logic)
        // If 480p is selected, we inject the transformation into the URL
        if (resolution === '480p') {
          videoUrl = videoUrl.replace('/upload/', '/upload/c_scale,h_480/');
        }

        setVideoSrc(videoUrl);
      }
    } catch (error) {
      console.error("Error fetching video list:", error);
    }
  };

  // Automatically load the video on mount and when resolution changes
  useEffect(() => {
    refreshPlayer();
  }, [resolution]);

  return (
    <div style={{ padding: '20px', background: '#1a1a1a', color: '#fff', borderRadius: '8px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' }}>
        <button onClick={refreshPlayer} style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
          <PlayArrowIcon style={{ fontSize: '18px', marginRight: '5px' }} /> Refresh Player
        </button>
        
        <select value={resolution} onChange={(e) => setResolution(e.target.value)}>
          <option value="original">Original Res</option>
          <option value="480p">480p (Low Bandwidth)</option>
        </select>
      </div>

      {videoSrc ? (
        <video controls width="100%" src={videoSrc} key={videoSrc} />
      ) : (
        <p style={{ color: '#aaa' }}>No video found in storage.</p>
      )}
    </div>
  );
}