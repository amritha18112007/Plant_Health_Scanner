import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Smartphone, ArrowLeft, CheckCircle } from 'lucide-react';

const AccountDetails = ({ onBack }) => {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <div style={headerRow}>
        <h1 style={pageTitle}>Account Security</h1>
        <button onClick={onBack} style={backBtn}><ArrowLeft size={18} /> Back to Hub</button>
      </div>

      <div style={securityCard}>
        <div style={statusBanner}>
          <CheckCircle size={20} />
          <span>System Status: Fully Encrypted (AES-256)</span>
        </div>
        
        <div style={settingRow}>
          <div style={iconBox}><Lock size={20} /></div>
          <div style={{ flex: 1, textAlign: 'left' }}>
            <h4 style={settingTitle}>Password Protection</h4>
            <p style={settingDesc}>Last updated during your last session.</p>
          </div>
          <button style={actionLink}>Update</button>
        </div>

        <div style={settingRow}>
          <div style={iconBox}><Smartphone size={20} /></div>
          <div style={{ flex: 1, textAlign: 'left' }}>
            <h4 style={settingTitle}>Device Management</h4>
            <p style={settingDesc}>Last active in Sankarnagar, India.</p>
          </div>
          <button style={actionLink}>Manage</button>
        </div>
      </div>
    </motion.div>
  );
};

// --- STYLES ---
const headerRow = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' };
const pageTitle = { fontSize: '2.4rem', fontWeight: '950', color: '#1e293b', margin: 0 };
const backBtn = { background: '#f1f5f9', border: 'none', padding: '12px 20px', borderRadius: '15px', fontWeight: '900', color: '#475569', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' };
const securityCard = { background: 'white', padding: '40px', borderRadius: '35px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' };
const statusBanner = { background: '#ecfdf5', color: '#10b981', padding: '15px', borderRadius: '15px', display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 'bold', fontSize: '0.9rem' };
const settingRow = { display: 'flex', alignItems: 'center', gap: '20px', padding: '25px 0', borderBottom: '1px solid #f1f5f9' };
const iconBox = { background: '#f1f5f9', padding: '12px', borderRadius: '12px', color: '#475569' };
const settingTitle = { margin: 0, fontSize: '1.1rem', color: '#1e293b', fontWeight: 'bold' };
const settingDesc = { margin: '4px 0 0 0', fontSize: '0.85rem', color: '#94a3b8' };
const actionLink = { background: 'none', border: 'none', color: '#10b981', fontWeight: '900', cursor: 'pointer' };

export default AccountDetails;