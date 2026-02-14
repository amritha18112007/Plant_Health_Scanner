// components/HomePage.js
import React from 'react';
import { motion } from 'framer-motion';
import { Camera, Globe, Leaf } from 'lucide-react';

const HomePage = ({ onStartScan }) => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ padding: '80px 40px', textAlign: 'left', maxWidth: '1200px', margin: '0 auto' }}>
    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '60px', alignItems: 'center' }}>
      <motion.div initial={{ x: -50 }} animate={{ x: 0 }}>
        <h1 style={{ fontSize: '4.5rem', fontWeight: '950', color: '#064e3b', lineHeight: '1' }}>
          Precision plant care <br /> <span style={{ color: '#10b981' }}>made easy.</span>
        </h1>
        <p style={{ fontSize: '1.3rem', color: '#64748b', margin: '30px 0 50px', maxWidth: '500px' }}>
          Advanced AI technology for farmers. Diagnose diseases, get local weather alerts, and grow the future.
        </p>
        <button onClick={onStartScan} className="spatial-button" style={{ padding: '25px 60px', fontSize: '1.2rem', borderRadius: '25px' }}>
          <Camera style={{marginRight: '10px'}} /> START SCANNING
        </button>
      </motion.div>
      
      <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} style={{ position: 'relative' }}>
         <img src="https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?w=800" style={{ width: '100%', borderRadius: '50px', boxShadow: '0 50px 100px rgba(0,0,0,0.1)' }} alt="Hero" />
      </motion.div>
    </div>
  </motion.div>
);

export default HomePage;