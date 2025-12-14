// src/App.js (Complete, Corrected Code)

import React, { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';
import Login from './components/Login'; 
import ScanPage from './components/ScanPage'; 
import ResultPage from './components/ResultPage'; 
import History from './components/History';
import AdminDashboard from './components/AdminDashboard';


function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userId, setUserId] = useState(null);
    // Initial view is 'login', but will check local storage
    const [currentView, setCurrentView] = useState('login'); 
    const [scanResult, setScanResult] = useState(null); 

    // 1. INITIAL SETUP: Check for saved user ID
    useEffect(() => {
        const storedUserId = localStorage.getItem('user_id');
        if (storedUserId) {
            setUserId(parseInt(storedUserId));
            setIsLoggedIn(true);
            setCurrentView('scan'); // Go straight to scan page if logged in
        }
    }, []);

    // 2. CORE HANDLERS
    const handleLoginSuccess = (id) => {
        setUserId(id);
        setIsLoggedIn(true);
        setCurrentView('scan'); 
        localStorage.setItem('user_id', id);
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
        setUserId(null);
        setCurrentView('login');
        localStorage.removeItem('user_id');
    };

    const handleScanComplete = (result) => {
        setScanResult(result);
        setCurrentView('result'); 
    };

    // 3. NAVIGATION HANDLERS (Fix for the previous errors)
    const handleViewHistory = () => {
        setCurrentView('history'); 
    };

    const handleViewAdmin = () => {
        setCurrentView('admin');
    };
    
    // 4. ROUTING LOGIC
    const renderView = () => {
        // Always show login if not authenticated
        if (!isLoggedIn) {
            // Login component only needs the success callback
            return <Login handleLoginSuccess={handleLoginSuccess} />; 
        }

        // Define the common props shared by Scan, Result, and History components
        const commonProps = {
            userId: userId,
            handleLogout: handleLogout,
            onNewScan: () => setCurrentView('scan'), // Button to go back to Scan page
            onViewHistory: handleViewHistory,        // Button to go to History page
            handleViewAdmin: handleViewAdmin,        // Button to go to Admin page
        };

        // Render the correct component based on currentView state
        switch (currentView) {
            case 'scan':
                return <ScanPage 
                    {...commonProps} 
                    onScanComplete={handleScanComplete}
                />;
            case 'result':
                return <ResultPage 
                    {...commonProps} 
                    result={scanResult} 
                />;
            case 'history':
                return <History 
                    {...commonProps} 
                />;
            case 'admin':
                return <AdminDashboard 
                    onBack={() => setCurrentView('scan')} // Back to Scan button
                    handleLogout={handleLogout} 
                />;
            default:
                // Fallback to login if somehow logged in but state is bad
                return <Login handleLoginSuccess={handleLoginSuccess} />; 
        }
    };

    return (
        <div className="App">
            {/* The single function call that renders the current page */}
            {renderView()} 
        </div>
    );
}

export default App;