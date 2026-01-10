// D:\plant_health_scanner_project\frontend\plant-scanner-ui\src\App.js
import React, { useState } from 'react';
import axios from 'axios';
import Login from './components/Login';
import ResultPage from './components/ResultPage';
import History from './components/History';
import './App.css';

function App() {
    // --- 1. STATE MANAGEMENT ---
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userId, setUserId] = useState(null);
    const [currentPage, setCurrentPage] = useState('login'); 
    const [scanResult, setScanResult] = useState(null);
    const [history, setHistory] = useState([]); // Initialized as empty array to prevent crashes

    // --- 2. BACKEND INTEGRATION ---
    
    // Fetch History from Django
    const fetchHistory = async () => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/history/?user_id=${userId}`);
            setHistory(response.data);
            setCurrentPage('history');
        } catch (error) {
            console.error("Error fetching history:", error);
            alert("Could not load history. Is the backend running?");
        }
    };

    // Handle Image Upload to Django
    const handleScanUpload = async (e) => {
        const imageFile = e.target.files[0];
        if (!imageFile) return;

        const formData = new FormData();
        formData.append('image', imageFile);
        formData.append('user_id', userId);

        try {
            const response = await axios.post('http://127.0.0.1:8000/api/upload/', formData);
            setScanResult(response.data);
            setCurrentPage('result');
        } catch (error) {
            console.error("Scan error:", error);
            alert("Scan failed. Check your Django terminal for errors.");
        }
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
        setUserId(null);
        setCurrentPage('login');
    };

    // --- 3. JSX RENDER LOGIC ---
    return (
        <div className="App">
            {/* 1. Login View */}
            {!isLoggedIn && (
                <Login onLogin={(id) => {
                    setUserId(id);
                    setIsLoggedIn(true);
                    setCurrentPage('scan');
                }} />
            )}

            {/* 2. Main Scan View (Internal UI to replace missing Scanner component) */}
            {isLoggedIn && currentPage === 'scan' && (
                <div className="glass-card">
                    <div className="spatial-header">
                        <h2>Scan <span style={{ color: 'var(--accent-mint)' }}>Leaf.</span></h2>
                        <p>Select a plant leaf for 10-species identification.</p>
                    </div>
                    
                    <div className="upload-section" style={{ margin: '40px 0' }}>
                        <input 
                            type="file" 
                            id="file-upload"
                            accept="image/*" 
                            onChange={handleScanUpload} 
                            style={{ display: 'none' }}
                        />
                        <label htmlFor="file-upload" className="primary-cta" style={{ display: 'block', textAlign: 'center', cursor: 'pointer' }}>
                            CHOOSE PHOTO
                        </label>
                    </div>
                    
                    <button onClick={fetchHistory} className="secondary-cta" style={{ width: '100%', marginBottom: '10px' }}>
                        VIEW SCAN HISTORY
                    </button>
                    <button onClick={handleLogout} style={{ background: 'none', border: 'none', color: 'white', opacity: 0.5, cursor: 'pointer', width: '100%' }}>
                        Logout
                    </button>
                </div>
            )}

            {/* 3. Result View */}
            {isLoggedIn && currentPage === 'result' && (
                <ResultPage 
                    result={scanResult} 
                    onNewScan={() => setCurrentPage('scan')} 
                />
            )}

            {/* 4. History View */}
            {isLoggedIn && currentPage === 'history' && (
                <History 
                    historyData={history} 
                    onBack={() => setCurrentPage('scan')} 
                />
            )}
        </div>
    );
}

export default App;