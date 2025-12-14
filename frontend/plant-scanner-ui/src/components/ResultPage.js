// src/components/ResultPage.js (Updated for design)
import React from 'react';
import './ComponentStyles.css'; // Import the new styles

function ResultPage({ result, onNewScan, handleLogout, onViewHistory, handleViewAdmin }) {
  if (!result) return <p>No scan result available.</p>;

  // Determine the visual style based on status
  const isHealthy = result.status === 'Healthy';
  // Use the CSS classes for styling the badge
  const badgeClass = isHealthy ? 'status-badge healthy-badge' : 'status-badge unhealthy-badge';
  const issueText = isHealthy ? 'Healthy' : result.type;

  return (
    <div className="page-container">
        {/* Navigation buttons */}
        <div className="top-nav">
            <button onClick={onViewHistory} className="nav-button">History</button> 
            <button onClick={handleViewAdmin} className="nav-button">Admin</button> 
            <button onClick={handleLogout} className="nav-button">Logout</button>
        </div>

      <div className="card result-card">
        <h2>Analysis Complete</h2>

        {/* Scan Result Section */}
        <div className="analysis-summary"> 
            <div className="summary-item">
                <strong>Identified Issue:</strong> {issueText || 'N/A'}
            </div>
            <div className="summary-item">
                <strong>Confidence Score:</strong> {result.confidence}%
            </div>
            <div className="summary-item">
                <span className={badgeClass}>
                    {result.status}
                </span>
            </div>
        </div>

        {/* Recommendation Section */}
        <h3>Our Recommendation</h3>
        <div className="recommendation-box">
          {result.recommendation}
        </div>
        
        <button 
          onClick={onNewScan}
          className="primary-button" /* Use primary-button for Scan Another */
          style={{ marginTop: '20px' }}
        >
          Scan Another Leaf
        </button>
      </div>
    </div>
  );
}

export default ResultPage;