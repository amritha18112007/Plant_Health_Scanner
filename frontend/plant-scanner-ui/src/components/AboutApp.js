import React from 'react';
import { motion } from 'framer-motion';
import { Info, Database, Activity, Target, ArrowLeft } from 'lucide-react';

const AboutApp = ({ onBack }) => {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <div style={headerRow}>
        <h1 style={pageTitle}>About App</h1>
        <button onClick={onBack} style={backBtn}><ArrowLeft size={18} /> Back to Hub</button>
      </div>

      <div style={contentCard}>
        <h2 style={{ color: '#064e3b', fontSize: '1.8rem' }}>Plant Doctor AI v2.0.4</h2>
        <p style={bodyText}>
          Plant Doctor is a high-precision diagnostic engine optimized for tropical agricultural landscapes. 
          Our model is trained on **28 distinct plant classes** to recognize pathogens with a baseline 
          <b> 94.2% AI Accuracy</b>.
        </p>

        <div style={grid3}>
          <div style={statBox}><Database color="#10b981" /> <h3 style={statNum}>28</h3> <p style={statLabel}>Plant Classes</p></div>
          <div style={statBox}><Target color="#3b82f6" /> <h3 style={statNum}>94.2%</h3> <p style={statLabel}>Accuracy</p></div>
          <div style={statBox}><Activity color="#f59e0b" /> <h3 style={statNum}>CNN</h3> <p style={statLabel}>Architecture</p></div>
        </div>
      </div>
    </motion.div>
  );
};

// --- STYLES ---
const headerRow = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' };
const pageTitle = { fontSize: '2.4rem', fontWeight: '950', color: '#1e293b', margin: 0 };
const backBtn = { background: '#f1f5f9', border: 'none', padding: '12px 20px', borderRadius: '15px', fontWeight: '900', color: '#475569', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' };
const contentCard = { background: 'white', padding: '40px', borderRadius: '35px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' };
const bodyText = { color: '#64748b', lineHeight: '1.6', fontSize: '1.1rem', fontWeight: '500', marginBottom: '30px', textAlign: 'left' };
const grid3 = { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' };
const statBox = { background: '#f8fafc', padding: '25px', borderRadius: '25px', textAlign: 'center' };
const statNum = { margin: '10px 0 5px 0', fontSize: '1.5rem', fontWeight: '900', color: '#1e293b' };
const statLabel = { margin: 0, fontSize: '0.8rem', color: '#94a3b8', fontWeight: 'bold' };

export default AboutApp;