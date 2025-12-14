// src/components/ScanPage.js (Updated for design)
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
      setError('Please select an image file first.');
      return;
    }

    const formData = new FormData();
    formData.append('user_id', userId);
    formData.append('image', selectedFile);

    setLoading(true);
    setError('');

    try {
      const response = await axios.post(API_URL, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      onScanComplete(response.data); 

    } catch (err) {
      setError(`Scan failed: ${err.response?.data?.error || 'Server error.'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
        <div className="top-nav">
            <button onClick={onViewHistory} className="nav-button">History</button> 
            <button onClick={handleViewAdmin} className="nav-button">Admin</button> 
            <button onClick={handleLogout} className="nav-button">Logout</button>
        </div>

      <h2>Your Digital Plant Doctor</h2>
      <p className="subtitle">Upload a photo of a plant leaf and our AI will instantly analyze its health.</p>

      <div className="card scan-card"> 
        <h3>Scan Your Plant Leaf</h3>
        <form onSubmit={handleScan}>
          <input type="file" onChange={handleFileChange} accept="image/*" />
          <button 
            type="submit" 
            className="scan-button"
            disabled={loading}
          >
            {loading ? 'Analyzing...' : 'Scan Now'}
          </button>
        </form>
        {error && <p className="error-message">{error}</p>}
      </div>
    </div>
  );
}

export default ScanPage;