import VideoUpload from './components/VideoUpload';
import VideoPlayer from './components/VideoPlayer';

export default function App() {
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px', fontFamily: 'system-ui, sans-serif' }}>
      
      <header style={{ marginBottom: '40px', textAlign: 'center' }}>
        <h1 style={{ color: '#111', fontSize: '2.5rem', marginBottom: '8px' }}>Local Stream Vault</h1>
        <p style={{ color: '#666', fontSize: '1.1rem' }}>Edge-optimized sequential binary chunking pipeline</p>
      </header>
      
      <main style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
        
        {/* Upload Portal Section */}
        <section style={{ background: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #eaeaea' }}>
          <h2 style={{ fontSize: '1.2rem', color: '#444', marginBottom: '15px' }}>Upload Portal</h2>
          <VideoUpload />
        </section>

        {/* Video Player Section */}
        <section style={{ background: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #eaeaea' }}>
          <h2 style={{ fontSize: '1.2rem', color: '#444', marginBottom: '15px' }}>Stored Stream Vault Player</h2>
          <VideoPlayer />
        </section>
        
      </main>
    </div>
  );
}