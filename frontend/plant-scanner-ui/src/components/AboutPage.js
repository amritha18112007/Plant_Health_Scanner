import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sprout, ShieldCheck, Zap, Activity, Globe, ArrowRight } from 'lucide-react';
import AuthPage from './AuthPage';

const AboutPage = ({ onAuthSuccess }) => {
  return (
    <div style={gatekeeperLayout}>
      {/* LEFT SIDE: AUTHENTICATION */}
      <div style={authSection}>
        <AuthPage setAuth={onAuthSuccess} />
      </div>

      {/* RIGHT SIDE: APP INFORMATION */}
      <div style={infoSection}>
        <motion.div 
          initial={{ opacity: 0, x: 50 }} 
          animate={{ opacity: 1, x: 0 }} 
          style={contentWrapper}
        >
          <div style={tagline}><Sprout size={20} /> Plant Doctor v2.0.4</div>
          <h1 style={heroTitle}>Advanced Crop <br/><span style={{color: '#10b981'}}>Health Analytics</span></h1>
          <p style={heroSub}>
            A professional diagnostic platform designed for Sankarnagar. 
            Utilizing state-of-the-art AI to identify 28 unique plant diseases with real-time care roadmaps.
          </p>

          <div style={featuresGrid}>
            <Feature icon={<ShieldCheck color="#10b981"/>} title="Secure Access" desc="Encrypted data handling for all user diagnostics." />
            <Feature icon={<Zap color="#10b981"/>} title="Instant Analysis" desc="Sub-second processing of leaf pigmentation patterns." />
            <Feature icon={<Globe color="#10b981"/>} title="Regional Intel" desc="Tailored advice based on local climate conditions." />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

const Feature = ({ icon, title, desc }) => (
  <div style={featureItem}>
    <div style={fIcon}>{icon}</div>
    <div>
      <h4 style={{margin: 0, color: '#1e293b'}}>{title}</h4>
      <p style={{margin: 0, fontSize: '0.85rem', color: '#64748b'}}>{desc}</p>
    </div>
  </div>
);

// Styles for the Gatekeeper
const gatekeeperLayout = { display: 'flex', minHeight: '100vh', background: '#ffffff' };
const authSection = { width: '40%', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRight: '1px solid #e2e8f0' };
const infoSection = { width: '60%', display: 'flex', alignItems: 'center', padding: '100px', background: 'linear-gradient(135deg, #ffffff 0%, #f0fdf4 100%)' };
const contentWrapper = { maxWidth: '600px' };
const heroTitle = { fontSize: '4rem', fontWeight: '950', color: '#0f172a', lineHeight: '1.1', marginBottom: '30px' };
const heroSub = { fontSize: '1.2rem', color: '#475569', lineHeight: '1.7', marginBottom: '50px' };
const tagline = { display: 'flex', alignItems: 'center', gap: '10px', fontWeight: '900', color: '#10b981', marginBottom: '20px', textTransform: 'uppercase', fontSize: '0.8rem' };
const featuresGrid = { display: 'grid', gridTemplateColumns: '1fr', gap: '30px' };
const featureItem = { display: 'flex', gap: '20px', alignItems: 'flex-start' };
const fIcon = { padding: '12px', background: 'white', borderRadius: '15px', boxShadow: '0 10px 20px rgba(0,0,0,0.05)' };

export default AboutPage;