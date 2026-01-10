// D:\plant_health_scanner_project\frontend\src\components\History.js
import React from 'react';
import './ComponentStyles.css';

// Adding = [] means: "if historyData is missing, treat it as an empty list"
function History({ historyData = [], onBack }) {
    return (
        <div className="glass-card" style={{ maxWidth: '1000px', width: '90%' }}>
            <div className="spatial-header" style={{ textAlign: 'left', marginBottom: '30px' }}>
                <h2 style={{ fontSize: '2.5rem', fontWeight: '800' }}>
                    Scan <span style={{ color: 'var(--accent-mint)' }}>History.</span>
                </h2>
                <p style={{ opacity: 0.6 }}>Review your past plant health diagnostics.</p>
            </div>

            <div className="history-container" style={{ overflowX: 'auto' }}>
                <table className="spatial-table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Plant Type</th>
                            <th>Status</th>
                            <th>Confidence</th>
                        </tr>
                    </thead>
                    <tbody>
                        {historyData.length > 0 ? (
                            historyData.map((item, index) => (
                                <tr key={index}>
                                    <td>{new Date(item.date).toLocaleDateString()}</td>
                                    <td><strong>{item.type}</strong></td>
                                    <td>
                                        <span className={`status-badge ${item.status.toLowerCase()}`}>
                                            {item.status.toUpperCase()}
                                        </span>
                                    </td>
                                    <td>{item.confidence}%</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" style={{ textAlign: 'center', padding: '40px', opacity: 0.5 }}>
                                    No scans found in your history.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <button onClick={onBack} className="secondary-cta" style={{ marginTop: '30px', width: '200px' }}>
                BACK TO SCANNER
            </button>
        </div>
    );
}

export default History;