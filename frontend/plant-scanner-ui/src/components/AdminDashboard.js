// src/components/AdminDashboard.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api/admin/metrics/'; 

function AdminDashboard({ onBack, handleLogout }) {
    const [metrics, setMetrics] = useState({
        total_users: 0,
        scans_conducted: 0,
        common_issues: [],
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchMetrics = async () => {
            try {
                // Fetch metrics from the working Django API
                const response = await axios.get(API_URL);
                setMetrics(response.data);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch admin metrics. Check server connection.');
                setLoading(false);
            }
        };

        fetchMetrics();
    }, []);

    const renderMetrics = () => {
        if (loading) return <p>Loading Admin Data...</p>;
        if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;

        return (
            <div style={{ display: 'flex', justifyContent: 'space-around', margin: '30px 0' }}>
                <MetricBox title="Total Users" value={metrics.total_users} />
                <MetricBox title="Scans Conducted" value={metrics.scans_conducted} />
            </div>
        );
    };

    const renderCommonIssues = () => {
        if (metrics.common_issues.length === 0) return <p>No diseases detected yet.</p>;

        return (
            <div style={{ marginTop: '30px', textAlign: 'left' }}>
                <h3>Top Detected Issues [cite: 28]</h3>
                <ol>
                    {metrics.common_issues.map((issue, index) => (
                        <li key={index}>
                            {issue.deficiency_type || 'N/A'}: **{issue.count}** detections
                        </li>
                    ))}
                </ol>
            </div>
        );
    };

    return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
            <div style={{ float: 'right' }}>
                <button onClick={onBack} style={{ marginRight: '10px' }}>Back to Scan</button>
                <button onClick={handleLogout}>Logout</button>
            </div>
            <h2>Admin Monitoring Dashboard</h2>
            <p>Overview of system activity and most common plant issues.</p>
            
            {renderMetrics()}
            {renderCommonIssues()}
            
            {/* Placeholder for data management [cite: 15-18] */}
            <div style={{ marginTop: '50px', borderTop: '1px solid #ccc', paddingTop: '20px' }}>
                <h3>Dataset Management (Future Scope)</h3>
                <p>This section is for managing the image dataset, labeling images, and retraining the ML model [cite: 15-24].</p>
                
            </div>
        </div>
    );
}

// Simple component for displaying a metric box
const MetricBox = ({ title, value }) => (
    <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '5px', minWidth: '150px' }}>
        <h4>{title}</h4>
        <p style={{ fontSize: '2em', margin: 0 }}>{value}</p>
    </div>
);

export default AdminDashboard;