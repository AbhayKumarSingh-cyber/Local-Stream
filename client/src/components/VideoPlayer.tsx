import { useState, useEffect } from 'react';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';

export default function VideoPlayer() {
  const [videoSrc, setVideoSrc] = useState<string>('');
  const [resolution, setResolution] = useState('original');

  const refreshPlayer = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/videos');
      const files = await response.json();
      
      if (files && files.length > 0) {
        const latestFile = files[files.length - 1];
        const baseUrl = "http://localhost:5000/uploads";
        
        const fileName = resolution === 'original' 
          ? latestFile 
          : latestFile.replace('.mp4', '_480p.mp4');

        setVideoSrc(`${baseUrl}/${encodeURIComponent(fileName)}`);
      }
    } catch (error) {
      console.error("Error fetching video list:", error);
    }
  };

  // Automatically load the video on mount
  useEffect(() => {
    refreshPlayer();
  }, [resolution]); // Refresh whenever resolution changes too

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
        <video controls width="100%" src={videoSrc} />
      ) : (
        <p style={{ color: '#aaa' }}>No video found in storage.</p>
      )}
    </div>
  );
}
