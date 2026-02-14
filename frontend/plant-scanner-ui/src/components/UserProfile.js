import React from 'react';
import { motion } from 'framer-motion';
import { User, MapPin, Award, ShieldCheck, ArrowLeft } from 'lucide-react';

const UserProfile = ({ username, userScans, onBack }) => {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <div style={headerRow}>
        <h1 style={pageTitle}>User Profile</h1>
        <button onClick={onBack} style={backBtn}><ArrowLeft size={18} /> Back to Hub</button>
      </div>

      <div style={profileCard}>
        <div style={avatarSection}>
          <div style={avatar}>{username ? username.charAt(0).toUpperCase() : 'U'}</div>
          <h2 style={{ margin: '15px 0 5px 0', fontSize: '1.8rem' }}>{username}</h2>
          <div style={badge}><ShieldCheck size={14} /> Verified Farmer</div>
        </div>

        <div style={infoGrid}>
          <div style={infoItem}>
            <MapPin size={20} color="#10b981" />
            <div style={{ textAlign: 'left' }}>
              <p style={infoLabel}>Primary Region</p>
              <p style={infoValue}>Sankarnagar, Tamil Nadu</p>
            </div>
          </div>
          <div style={infoItem}>
            <Award size={20} color="#f59e0b" />
            <div style={{ textAlign: 'left' }}>
              <p style={infoLabel}>Total Contribution</p>
              <p style={infoValue}>{userScans || 0} Diagnoses</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// --- STYLES ---
const headerRow = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' };
const pageTitle = { fontSize: '2.4rem', fontWeight: '950', color: '#1e293b', margin: 0 };
const backBtn = { background: '#f1f5f9', border: 'none', padding: '12px 20px', borderRadius: '15px', fontWeight: '900', color: '#475569', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' };
const profileCard = { background: 'white', padding: '40px', borderRadius: '35px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', textAlign: 'center' };
const avatarSection = { marginBottom: '30px' };
const avatar = { width: '100px', height: '100px', borderRadius: '50%', background: '#10b981', color: 'white', fontSize: '2.5rem', fontWeight: '900', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto' };
const badge = { display: 'inline-flex', alignItems: 'center', gap: '5px', background: '#ecfdf5', color: '#10b981', padding: '6px 14px', borderRadius: '10px', fontSize: '0.8rem', fontWeight: 'bold' };
const infoGrid = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '40px' };
const infoItem = { background: '#f8fafc', padding: '20px', borderRadius: '20px', display: 'flex', gap: '15px', alignItems: 'center' };
const infoLabel = { margin: 0, fontSize: '0.75rem', color: '#94a3b8', fontWeight: 'bold' };
const infoValue = { margin: 0, fontSize: '1rem', fontWeight: '900', color: '#1e293b' };

export default UserProfile;