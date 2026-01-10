// D:\plant_health_scanner_project\frontend\src\components\ResultPage.js
import React from 'react';
import './ComponentStyles.css';

function ResultPage({ result, onNewScan }) {
  if (!result) return <p className="error-message">No scan result available.</p>;

  // Check if status exists to avoid crashes, default to 'Diseased' if not found
  const isHealthy = result.status === 'Healthy';

  // Helper function to safely find the uploaded image source
  const getDisplayImage = () => {
    // 1. Prioritize the direct full URL from the backend
    if (result.image_url) return result.image_url;
    
    // 2. Fallback to local file object if it's a valid Blob/File
    if (result.original_image instanceof Blob || result.original_image instanceof File) {
      return URL.createObjectURL(result.original_image);
    }
    
    // 3. Last resort placeholder
    return "https://via.placeholder.com/400?text=No+Image+Found";
  };

  return (
    <div className="glass-card">
      <div className="spatial-header" style={{ textAlign: 'left', marginBottom: '40px' }}>
        <h2 style={{ fontSize: '2.5rem', fontWeight: '800' }}>
          Analysis <span style={{ color: 'var(--accent-mint)' }}>Complete.</span>
        </h2>
      </div>

      <div className="comparison-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', margin: '30px 0' }}>
        
        {/* LEFT BOX: Your Uploaded Leaf */}
        <div className="image-box">
          <p className="label" style={{ opacity: 0.5, fontSize: '0.8rem', fontWeight: 'bold' }}>ORIGINAL SCAN</p>
          <div className="img-frame" style={{ height: '300px', borderRadius: '20px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
            <img 
              src={getDisplayImage()} 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
              alt="Uploaded Scan" 
            />
          </div>
        </div>

        {/* RIGHT BOX: The Healthy Target Leaf */}
        <div className="image-box">
          <p className="label" style={{ opacity: 0.5, fontSize: '0.8rem', fontWeight: 'bold' }}>GOAL CONDITION</p>
          <div className="img-frame" style={{ height: '300px', borderRadius: '20px', overflow: 'hidden', border: '2px solid var(--accent-mint)' }}>
            <img 
              src={result.target_image_url} 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
              alt="Healthy Target" 
            />
          </div>
        </div>
      </div>

      <div className="diagnosis-details" style={{ marginTop: '30px', padding: '20px', background: 'rgba(255,255,255,0.05)', borderRadius: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
           <h3 style={{ margin: 0 }}>{result.type || 'Plant Condition'}</h3>
           <span style={{ 
             background: isHealthy ? '#b7e4c7' : '#ffccd5', 
             color: isHealthy ? '#1b4332' : '#800f2f',
             padding: '5px 15px', borderRadius: '50px', fontWeight: 'bold' 
           }}>
             {(result.status || 'Diseased').toUpperCase()}
           </span>
        </div>
        <p style={{ opacity: 0.7, marginTop: '15px' }}>{result.recommendation}</p>
        <p style={{ fontSize: '0.8rem', opacity: 0.4 }}>Accuracy: {result.confidence}%</p>
      </div>

      <button onClick={onNewScan} className="primary-cta" style={{ width: '100%', marginTop: '30px', padding: '15px', borderRadius: '15px', border: 'none', background: 'var(--accent-mint)', fontWeight: 'bold', cursor: 'pointer' }}>
        SCAN ANOTHER LEAF
      </button>
    </div>
  );
}

export default ResultPage;