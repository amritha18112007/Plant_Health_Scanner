import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AnimatePresence, motion } from 'framer-motion';

import AboutPage from './components/AboutPage'; 
import HomePage from './components/HomePage';
import AdminDashboard from './components/AdminDashboard';
import History from './components/History';
import ResultPage from './components/ResultPage';
import Sidebar from './components/Sidebar';
import UserProfile from './components/UserProfile';
import AccountDetails from './components/AccountDetails';
import AboutApp from './components/AboutApp';
import Downloads from './components/Downloads';

import './App.css'; 

function App() {
    const [user, setUser] = useState(null); 
    const [currentPage, setCurrentPage] = useState('landing'); 
    const [dashboardPage, setDashboardPage] = useState('main'); 
    const [stats, setStats] = useState({ total_scans: 0, total_users: 0, user_scans: 0, healthy_ratio: "0%" });
    const [scanResult, setScanResult] = useState(null);
    const [history, setHistory] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setUser({ username: localStorage.getItem('username') });
            setCurrentPage('home'); 
            fetchStats();
        }
    }, []);

    const fetchStats = async () => {
        try {
            const res = await axios.get('http://127.0.0.1:8000/api/admin/metrics/');
            setStats(res.data); 
        } catch (e) { console.error("Stats failed"); }
    };

    const fetchHistory = async () => {
        setIsLoading(true);
        try {
            const res = await axios.get(`http://127.0.0.1:8000/api/user/history/`);
            setHistory(res.data);
            setDashboardPage('history');
            setCurrentPage('dashboard'); // Walk into the "Dashboard Stage"
        } catch (e) { alert("Error loading history"); } 
        finally { setIsLoading(false); setIsSidebarOpen(false); }
    };

    // THE MASTER NAVIGATOR: This fixes the "no use" issue
    const navigateTo = (target) => {
        setIsSidebarOpen(false);
        if (target === 'home') {
            setCurrentPage('home');
        } else if (target === 'history') {
            fetchHistory();
        } else {
            setDashboardPage(target);
            setCurrentPage('dashboard'); // Force stage switch
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        setUser(null);
        setCurrentPage('landing');
    };

    // ROUTER COMPONENT: Ensures the right page is rendered
    const renderActivePage = () => {
        switch(dashboardPage) {
            case 'history': return <History historyData={history} onBack={() => setDashboardPage('main')} onRefresh={fetchHistory} />;
            case 'profile': return <UserProfile username={user?.username} userScans={stats.user_scans} onBack={() => setDashboardPage('main')} />;
            case 'account': return <AccountDetails onBack={() => setDashboardPage('main')} />;
            case 'about': return <AboutApp onBack={() => setDashboardPage('main')} />;
            case 'downloads': return <Downloads historyData={history} onBack={() => setDashboardPage('main')} />;
            case 'result': return <ResultPage result={scanResult} onNewScan={() => setDashboardPage('main')} />;
            default: return (
                <AdminDashboard 
                    username={user?.username} 
                    stats={stats} 
                    onOpenMenu={() => setIsSidebarOpen(true)}
                    onBack={() => setCurrentPage('home')}
                    onStartScan={() => document.getElementById('file-input').click()} 
                    onLogout={handleLogout}
                />
            );
        }
    };

    return (
        <div className="App">
            {isLoading && <div className="loading-overlay"><div className="spinner"></div><p>Syncing Sankarnagar Data...</p></div>}

            {user && (
                <Sidebar 
                    isOpen={isSidebarOpen} 
                    onClose={() => setIsSidebarOpen(false)}
                    username={user.username}
                    onLogout={handleLogout}
                    onNavigate={navigateTo} 
                />
            )}

            <AnimatePresence mode="wait">
                {currentPage === 'landing' && <AboutPage key="landing" onAuthSuccess={() => setCurrentPage('home')} />}
                
                {currentPage === 'home' && (
                    <HomePage 
                        key="home"
                        username={user?.username}
                        onOpenMenu={() => setIsSidebarOpen(true)}
                        onStartScan={() => navigateTo('main')} 
                        onViewHistory={fetchHistory}
                    />
                )}

                {currentPage === 'dashboard' && (
                    <motion.div 
                        key="dashboard-stage"
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="dashboard-stage-container"
                    >
                        {renderActivePage()}
                    </motion.div>
                )}
            </AnimatePresence>

            <input type="file" id="file-input" style={{ display: 'none' }} accept="image/*" />
        </div>
    );
}

export default App;