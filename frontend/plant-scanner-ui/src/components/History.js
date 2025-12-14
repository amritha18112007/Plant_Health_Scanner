// src/components/History.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api/user/history/'; 

function History({ userId, onNewScan, handleLogout,handleViewAdmin }) {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                // Fetch history for the logged-in user ID
                const response = await axios.get(API_URL, {
                    params: { user_id: userId } 
                });
                setHistory(response.data.history);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch scan history.');
                setLoading(false);
            }
        };

        fetchHistory();
    }, [userId]); // Dependency array runs effect when userId changes

    const renderHistoryTable = () => {
        if (loading) return <p>Loading history...</p>;
        if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;
        if (history.length === 0) return <p>No scans found yet. Time to check your plants!</p>;

        return (
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
                <thead>
                    <tr style={{ backgroundColor: '#f2f2f2' }}>
                        <th style={{ border: '1px solid #ddd', padding: '8px' }}>Date</th>
                        <th style={{ border: '1px solid #ddd', padding: '8px' }}>Status</th>
                        <th style={{ border: '1px solid #ddd', padding: '8px' }}>Issue Identified</th>
                        <th style={{ border: '1px solid #ddd', padding: '8px' }}>Confidence (%)</th>
                        <th style={{ border: '1px solid #ddd', padding: '8px' }}>Recommendation</th>
                    </tr>
                </thead>
                <tbody>
                    {history.map((scan) => (
                        <tr key={scan.id}>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{scan.date}</td>
                            <td style={{ border: '1px solid #ddd', padding: '8px', color: scan.status === 'Healthy' ? 'green' : 'red' }}>{scan.status}</td>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{scan.type}</td>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{parseFloat(scan.confidence).toFixed(2)}</td>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{scan.recommendation_summary.substring(0, 50)}...</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    };

    return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
            <div style={{ float: 'right' }}>
                <button onClick={onNewScan} style={{ marginRight: '10px' }}>New Scan</button>
                <button onClick={handleViewAdmin} style={{ marginRight: '10px' }}>Admin</button>
                <button onClick={handleLogout}>Logout</button>
            </div>
            <h2>Scan History & Health Tracking</h2>
            <p>View all past analyses and track plant health over time.</p>
            
            {renderHistoryTable()}
            
            {/* Placeholder for Graphs and Tracking [cite: 51-54, 134] */}
            <div style={{ marginTop: '50px', borderTop: '1px solid #ccc', paddingTop: '20px' }}>
                <h3>Health Trends (Placeholder for Graphs)</h3>
                <p>Graphs (Timeline, Comparison of health, Frequency of diseases) would go here to provide visual tracking [cite: 52-54].</p>
                
            </div>
        </div>
    );
}

export default History;