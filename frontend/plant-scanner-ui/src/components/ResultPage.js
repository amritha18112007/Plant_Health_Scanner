import React from 'react';
import { motion } from 'framer-motion';
import { 
  HelpCircle, 
  CheckCircle, 
  ThermometerSun, 
  AlertTriangle, 
  ClipboardList 
} from 'lucide-react';

function ResultPage({ result, onNewScan }) {
    // Parsing the structured 6-part report string from views.py
    // Format: Score | Cause | Treatment | Prognosis | Next Step | Healthy_Img
    const reportParts = result.diagnosis_report ? result.diagnosis_report.split(' | ') : [];
    
    const cause = reportParts[1]?.replace('Cause: ', '');
    const treatment = reportParts[2]?.replace('Treatment: ', '');
    const prognosis = reportParts[3]?.replace('Prognosis: ', '');
    const nextStep = reportParts[4]?.replace('Next Step: ', '');
    const healthyImg = reportParts[5]?.replace('Healthy_Img: ', '');

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            style={{ width: '100%', maxWidth: '1100px', margin: '0 auto', padding: '20px' }}
        >
            <div style={{ background: 'white', borderRadius: '40px', padding: '40px', boxShadow: '0 20px 40px rgba(0,0,0,0.05)' }}>
                
                {/* Weather Context (Sankarnagar 2026-01-20) */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#fff7ed', padding: '10px 20px', borderRadius: '15px', border: '1px solid #ffedd5' }}>
                        <ThermometerSun size={18} color="#f59e0b" />
                        <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#9a3412' }}>SANKARNAGAR: 30°C & SUNNY</span>
                    </div>
                </div>

                <h1 style={{ fontSize: '3rem', fontWeight: '900', color: '#1e293b', marginBottom: '40px', textAlign: 'left' }}>
                    {result.label} <span style={{ color: '#10b981', fontSize: '1.5rem' }}>({result.confidence}%)</span>
                </h1>

                {/* The 3-Column Visual Roadmap */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '25px', marginBottom: '50px' }}>
                    <div style={imageCardContainer}>
                        <p style={imageLabelStyle}>1. ORIGINAL SCAN</p>
                        <div style={imageFrameStyle}>
                            <img src={`http://localhost:8000${result.original_url}`} style={imageStyle} alt="Scan" />
                        </div>
                    </div>
                    
                    <div style={imageCardContainer}>
                        <p style={{ ...imageLabelStyle, color: '#f59e0b' }}>2. AI DIAGNOSTIC</p>
                        <div style={{ ...imageFrameStyle, border: '4px solid #fef3c7' }}>
                            <img src={`http://localhost:8000${result.heatmap}`} style={imageStyle} alt="Heatmap" />
                        </div>
                    </div>

                    <div style={imageCardContainer}>
                        <p style={{ ...imageLabelStyle, color: '#10b981' }}>3. HEALTHY TARGET</p>
                        <div style={{ ...imageFrameStyle, border: '4px solid #dcfce7' }}>
                            <img 
                                src={healthyImg === 'self' ? `http://localhost:8000${result.original_url}` : `http://localhost:8000/media/healthy_refs/${healthyImg}`} 
                                style={imageStyle} 
                                alt="Target" 
                                onError={(e) => e.target.src = 'https://via.placeholder.com/400x300?text=Reference+Loading...'}
                            />
                        </div>
                    </div>
                </div>

                {/* Intelligence Cards Section */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', textAlign: 'left', marginBottom: '30px' }}>
                    <div style={infoCardStyle}>
                        <div style={iconHeaderStyle}>
                            <HelpCircle size={24} color="#64748b" />
                            <h4 style={infoTitleStyle}>WHY IT HAPPENED?</h4>
                        </div>
                        <p style={infoTextStyle}>{cause || "Awaiting environmental analysis..."}</p>
                    </div>

                    <div style={{ ...infoCardStyle, background: '#f0fdf4', border: '1px solid #dcfce7' }}>
                        <div style={{ ...iconHeaderStyle, color: '#16a34a' }}>
                            <ClipboardList size={24} />
                            <h4 style={infoTitleStyle}>TREATMENT PLAN</h4>
                        </div>
                        <p style={{ ...infoTextStyle, color: '#166534' }}>{treatment || "Standard care protocols recommended."}</p>
                    </div>
                </div>

                {/* Recovery & Next Action Section */}
                <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '30px', textAlign: 'left' }}>
                    <div style={{ ...infoCardStyle, background: '#eff6ff', border: '1px solid #dbeafe' }}>
                        <div style={{ ...iconHeaderStyle, color: '#2563eb' }}>
                            <CheckCircle size={24} />
                            <h4 style={infoTitleStyle}>RECOVERY ROADMAP</h4>
                        </div>
                        <p style={{ ...infoTextStyle, color: '#1e40af', fontStyle: 'italic' }}>{prognosis}</p>
                    </div>

                    <div style={{ ...infoCardStyle, background: '#fff7ed', border: '1px solid #ffedd5' }}>
                        <div style={{ ...iconHeaderStyle, color: '#ea580c' }}>
                            <AlertTriangle size={24} />
                            <h4 style={infoTitleStyle}>NEXT CRITICAL STEP</h4>
                        </div>
                        <p style={{ ...infoTextStyle, color: '#9a3412', fontWeight: '700' }}>{nextStep}</p>
                    </div>
                </div>

                <button onClick={onNewScan} style={backBtnStyle}>
                    START NEW SCAN
                </button>
            </div>
        </motion.div>
    );
}

// Styling Constants
const imageCardContainer = { textAlign: 'center' };
const imageLabelStyle = { fontSize: '0.7rem', fontWeight: '900', color: '#94a3b8', marginBottom: '10px', textTransform: 'uppercase' };
const imageFrameStyle = { height: '240px', borderRadius: '25px', overflow: 'hidden', border: '4px solid #f1f5f9', boxShadow: '0 10px 20px rgba(0,0,0,0.05)' };
const imageStyle = { width: '100%', height: '100%', objectFit: 'cover' };

const infoCardStyle = { padding: '30px', borderRadius: '30px', background: '#f8fafc' };
const iconHeaderStyle = { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' };
const infoTitleStyle = { margin: 0, fontWeight: '900', fontSize: '0.9rem', letterSpacing: '0.05em' };
const infoTextStyle = { margin: 0, fontSize: '1rem', color: '#475569', lineHeight: '1.6' };

const backBtnStyle = { 
    marginTop: '50px', 
    width: '100%', 
    background: '#0f172a', 
    color: 'white', 
    padding: '22px', 
    borderRadius: '24px', 
    fontWeight: '950', 
    fontSize: '1.1rem',
    cursor: 'pointer', 
    border: 'none',
    boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
};

export default ResultPage;