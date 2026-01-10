// src/components/ScanPage.js
import React, { useState } from 'react';
import axios from 'axios';
import './ComponentStyles.css'; 

const API_URL = 'http://127.0.0.1:8000/api/scan/upload/';

function ScanPage({ userId, onScanComplete, handleLogout, onViewHistory, handleViewAdmin }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleScan = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setError('Please select an image file first.'); // Replaces alert("Please upload an image first")
      return;
    }

    const formData = new FormData();
    formData.append('user_id', userId);
    formData.append('image', selectedFile);

    setLoading(true); // This shows the "Analyzing..." loader in your UI
    setError('');

    try {
      // 1. SIMULATE PROCESSING DELAY (from your second code block)
      // This kee
      // ps the loader visible for 3 seconds so users see the "AI studying" phase
      await new Promise(resolve => setTimeout(resolve, 3000));

      // 2. ACTUAL API CALL
      const response = await axios.post(API_URL, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      // 3. COMPLETE
      onScanComplete(response.data); 

    } catch (err) {
      setError(`Scan failed: ${err.response?.data?.error || 'Server error.'}`);
    } finally {
      setLoading(false); // This hides the loader (replaces loadingOverlay.style.display = "none")
    }
  };

 /// src/components/ScanPage.js
return (
  <div className="glass-card">
    <div className="spatial-header" style={{ textAlign: 'left', marginBottom: '50px' }}>
      <h1 style={{ fontSize: '3rem', fontWeight: '800', letterSpacing: '-2px', margin: 0 }}>
        Plant <span style={{ color: 'var(--accent-mint)' }}>Doctor.</span>
      </h1>
      <p style={{ opacity: 0.6, fontSize: '1.2rem' }}>Precision AI diagnostics for your greenery.</p>
    </div>

    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '60px', alignItems: 'center' }}>
      <div className="upload-section">
        <h2 style={{ fontSize: '2rem', marginBottom: '10px' }}>Analyze Leaf</h2>
        <p style={{ opacity: 0.5 }}>Upload a clear photo to begin the neural scan.</p>
        
        <div className="custom-upload-container" style={{ marginTop: '40px' }}>
          <input type="file" onChange={handleFileChange} id="leaf-upload" hidden />
          <label htmlFor="leaf-upload" className="glass-button" style={{ padding: '20px', cursor: 'pointer', display: 'block', textAlign: 'center', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '20px' }}>
            {selectedFile ? selectedFile.name : 'CHOOSE IMAGE'}
          </label>
          
          <button 
            onClick={handleScan}
            disabled={loading}
            className="primary-cta"
            style={{
              width: '100%',
              marginTop: '25px',
              padding: '20px',
              background: 'var(--accent-mint)',
              color: '#081c15',
              border: 'none',
              borderRadius: '20px',
              fontSize: '1.1rem',
              fontWeight: '900',
              cursor: 'pointer'
            }}
          >
            {loading ? 'PROCESSING...' : 'SCAN NOW'}
          </button>
        </div>
      </div>

      <div className="decorative-preview">
        {/* Placeholder image that looks classy like your Monstera reference */}
        <img 
          src="https://images.unsplash.com/photo-1614594975525-e45190c55d0b?q=80&w=600" 
          alt="Monstera" 
          style={{ width: '100%', borderRadius: '30px', filter: 'brightness(0.8)' }} 
        />
      </div>
    </div>
  </div>
);}

export default ScanPage;