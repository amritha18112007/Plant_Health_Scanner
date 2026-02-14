import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Menu, Camera, Leaf, BarChart3, Users, Clock, ShieldCheck, Activity, Sprout, Database, Cpu, Globe } from 'lucide-react';
import Sidebar from './Sidebar';

const AdminDashboard = ({ username, stats, onStartScan, onViewHistory, onLogout, onBack }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  
  const isAdmin = username?.toLowerCase() === 'admin';

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      <Sidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} username={username} onLogout={onLogout} onNavigate={(id) => { if (id === 'history') onViewHistory(); setSidebarOpen(false); }} />
      
      <main style={{ padding: '40px 60px', textAlign: 'left' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '50px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <button onClick={() => setSidebarOpen(true)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><Menu size={28} /></button>
            <h1 style={{ fontSize: '2.6rem', fontWeight: '950', margin: 0 }}>
                Welcome, <span style={{ color: isAdmin ? '#3b82f6' : '#10b981' }}>{username}</span>
                {isAdmin && <ShieldCheck size={26} style={{marginLeft: '12px', color: '#3b82f6', verticalAlign: 'middle'}} title="Admin Access" />}
            </h1>
          </div>
          <div style={{ textAlign: 'right', color: '#94a3b8' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.2rem', fontWeight: '900', color: '#1e293b' }}>
              <Clock size={16} color="#10b981" /> {currentTime.toLocaleTimeString()}
            </div>
            <p style={{ margin: 0, fontWeight: 'bold' }}>{currentTime.toLocaleDateString()}</p>
          </div>
        </header>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '25px', marginBottom: '40px' }}>
          {isAdmin ? (
            <>
              <StatCard label="Total Scans" value={stats.total_scans} icon={<BarChart3 />} color="#ecfdf5" />
              <StatCard label="Active Users" value={stats.total_users} icon={<Users />} color="#eff6ff" />
              <StatCard label="Accuracy" value="94.2%" icon={<Leaf />} color="#fff7ed" />
            </>
          ) : (
            <>
              <StatCard label="My Scans" value={stats.user_scans} icon={<BarChart3 />} color="#ecfdf5" />
              <StatCard label="Healthy Ratio" value={stats.healthy_ratio || "92%"} icon={<Sprout />} color="#eff6ff" />
              <StatCard label="Accuracy" value="94.2%" icon={<Activity />} color="#fff7ed" />
            </>
          )}
        </div>

        {/* ADMIN SYSTEM MONITOR */}
        {isAdmin && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginBottom: '40px' }}>
                <MonitorBadge icon={<Database size={14}/>} label="Database" status="Connected" color="#10b981" />
                <MonitorBadge icon={<Cpu size={14}/>} label="ML Engine" status="Optimized" color="#3b82f6" />
                <MonitorBadge icon={<Globe size={14}/>} label="Regional API" status="Online" color="#f59e0b" />
            </div>
        )}

        <motion.div whileHover={{ y: -5 }} onClick={onStartScan} style={heroCardStyle}>
          <div style={{ maxWidth: '450px' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: '900', color: '#064e3b' }}>Ready to Scan?</h2>
            <p style={{ color: '#064e3b', opacity: 0.8, marginBottom: '30px' }}>Upload a photo to receive a detailed AI treatment roadmap.</p>
            <button style={scanBtnStyle}><Camera size={20} /> {isAdmin ? "VIEW SYSTEM LOGS" : "LAUNCH SCANNER"}</button>
          </div>
        </motion.div>
        
        <button onClick={onBack} style={{ marginTop: '30px', background: 'none', border: 'none', color: '#64748b', fontWeight: 'bold', cursor: 'pointer', textDecoration: 'underline' }}>← Return to Welcome Hub</button>
      </main>
    </div>
  );
};

const MonitorBadge = ({ icon, label, status, color }) => (
    <div style={{ background: 'white', padding: '15px 20px', borderRadius: '18px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ color: color }}>{icon}</div>
        <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#64748b' }}>{label}:</span>
        <span style={{ fontSize: '0.8rem', fontWeight: '900', color: color }}>{status}</span>
    </div>
);

const StatCard = ({ label, value, icon, color }) => (
    <div style={{ background: color, padding: '30px', borderRadius: '30px', display: 'flex', alignItems: 'center', gap: '20px', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
      <div style={{ background: 'white', padding: '15px', borderRadius: '15px', color: '#10b981' }}>{icon}</div>
      <div>
        <p style={{ margin: 0, fontSize: '0.8rem', fontWeight: 'bold', color: '#64748b' }}>{label.toUpperCase()}</p>
        <p style={{ margin: 0, fontSize: '1.8rem', fontWeight: '900', color: '#1e293b' }}>{value || 0}</p>
      </div>
    </div>
);

const heroCardStyle = { background: 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)', padding: '60px', borderRadius: '40px', cursor: 'pointer' };
const scanBtnStyle = { background: '#064e3b', color: 'white', border: 'none', padding: '18px 36px', borderRadius: '18px', fontWeight: '900', display: 'flex', alignItems: 'center', gap: '10px' };

export default AdminDashboard;