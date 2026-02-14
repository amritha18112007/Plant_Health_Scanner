import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, 
  ChevronRight, 
  Trash2, 
  Activity,
  FileText,
  ShieldAlert,
  Stethoscope,
  Zap,
  Target
} from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import axios from 'axios';

const History = ({ historyData, onBack, onRefresh }) => {
  const [selectedScan, setSelectedScan] = useState(null);
  const reportRef = useRef();

  const parseReport = (raw) => {
    if (!raw) return {};
    const parts = raw.split(' | ');
    return {
        score: parts[0]?.replace('Score: ', '') || 'N/A',
        cause: parts[1]?.replace('Cause: ', '') || 'Under Investigation',
        treatment: parts[2]?.replace('Treatment: ', '') || 'Consult local expert',
        prognosis: parts[3]?.replace('Prognosis: ', '') || 'Monitoring required',
        nextStep: parts[4]?.replace('Next Step: ', '') || 'Keep leaf surfaces dry'
    };
  };

  const handleDownloadPDF = async () => {
    const element = reportRef.current;
    const canvas = await html2canvas(element, { scale: 3, useCORS: true });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`PlantDoctor_Report_${selectedScan?.plant_name}.pdf`);
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation(); 
    if (window.confirm("Delete this diagnostic record?")) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:8000/api/scan/delete/${id}/`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        onRefresh(); 
      } catch (err) { alert("Error deleting record."); }
    }
  };

  const getMotivation = (label) => {
    if (label.toLowerCase().includes('healthy')) return "Excellent! Peak physiological health.";
    return "Stay positive! Early detection is key to saving your crop.";
  };

  const DetailSection = ({ icon: Icon, title, text, bgColor }) => (
    <div style={{ padding: '25px', borderRadius: '25px', background: bgColor, marginBottom: '15px', display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
            <div style={{ background: 'white', padding: '8px', borderRadius: '10px', display: 'flex' }}><Icon size={18} color="#1e293b"/></div>
            <span style={{ fontSize: '0.8rem', fontWeight: '900', color: '#64748b', letterSpacing: '0.05em' }}>{title.toUpperCase()}</span>
        </div>
        <p style={{ margin: 0, fontSize: '1.05rem', color: '#334155', fontWeight: '600', lineHeight: '1.6' }}>{text}</p>
    </div>
  );

  const renderDetailedView = () => {
    if (!selectedScan) return null;
    const report = parseReport(selectedScan.recommendation);

    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={overlay}>
        <motion.div initial={{ y: 50, scale: 0.95 }} animate={{ y: 0, scale: 1 }} style={modal}>
          <div ref={reportRef} style={scrollableReportContent}>
            <div style={detailHeaderGrid}>
              <div style={detailImgWrapper}>
                 <img src={`http://localhost:8000${selectedScan.original_url}`} style={detailMainImg} alt="Scan" />
                 <div style={confidenceOverlay}><Target size={14} /> Confidence: {report.score}</div>
              </div>
              <div style={detailTitleStack}>
                <h2 style={detailPlantTitle}>{selectedScan.plant_name}</h2>
                <div style={motivationCard}>
                    <p style={motivationText}>{getMotivation(selectedScan.plant_name)}</p>
                </div>
              </div>
            </div>

            {/* DETAILED STRUCTURED REPORT */}
            <DetailSection icon={Stethoscope} title="Root Cause" text={report.cause} bgColor="#eff6ff" />
            <DetailSection icon={FileText} title="Treatment Plan" text={report.treatment} bgColor="#ecfdf5" />
            <DetailSection icon={Zap} title="Expected Prognosis" text={report.prognosis} bgColor="#fff7ed" />
            <DetailSection icon={ShieldAlert} title="Next Critical Step" text={report.nextStep} bgColor="#fef2f2" />
          </div>
          
          <div style={modalActions}>
            <button onClick={handleDownloadPDF} style={pdfBtn}>DOWNLOAD PDF REPORT</button>
            <button onClick={() => setSelectedScan(null)} style={closeBtn}>DISMISS</button>
          </div>
        </motion.div>
      </motion.div>
    );
  };

  return (
    <div style={containerStyle}>
      <div style={headerNav}>
        <motion.button whileHover={{ x: -5 }} onClick={onBack} style={backBtn}>
          ← Back to Hub
        </motion.button>
        <div style={{ textAlign: 'right' }}>
            <h2 style={titleStyle}>Diagnostic Archives</h2>
            <p style={subTitleStyle}>Your user-specific history in Sankarnagar</p>
        </div>
      </div>

      <div style={listContainer}>
        {historyData.length === 0 ? (
          <div style={emptyStateStyle}>
            <Activity size={64} color="#cbd5e1" />
            <p>No diagnostics found.</p>
            <button onClick={onBack} style={startScanBtn}>Start First Scan</button>
          </div>
        ) : (
          historyData.map((item) => {
            const report = parseReport(item.recommendation);
            return (
              <motion.div key={item.id} onClick={() => setSelectedScan(item)} style={historyRow} whileHover={{ scale: 1.015, borderColor: '#10b981' }}>
                <div style={thumbWrapper}>
                    <img src={`http://localhost:8000${item.original_url}`} style={thumbStyle} alt="Thumb" />
                </div>
                <div style={textStack}>
                  <div style={row1}>
                    <b style={plantNameLabel}>{item.plant_name}</b>
                    <span style={dateStyle}><Calendar size={12} style={{marginRight: '4px'}}/> {item.date}</span>
                  </div>
                  <div style={row2}>Confidence Score: {report.score}</div>
                  <div style={row3}>{report.cause}</div>
                </div>
                <div style={actionGroup}>
                  <motion.button whileHover={{ scale: 1.2, color: '#ef4444' }} onClick={(e) => handleDelete(e, item.id)} style={deleteBtnStyle}>
                    <Trash2 size={20} />
                  </motion.button>
                  <ChevronRight size={24} color="#cbd5e1" />
                </div>
              </motion.div>
            );
          })
        )}
      </div>
      <AnimatePresence>{renderDetailedView()}</AnimatePresence>
    </div>
  );
};

// --- STYLES (MATCHED TO YOUR ORIGINAL CSS) ---
const containerStyle = { maxWidth: '1000px', margin: '0 auto', padding: '60px 20px' };
const headerNav = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '50px' };
const backBtn = { background: 'white', border: '1px solid #e2e8f0', padding: '12px 24px', borderRadius: '15px', fontWeight: '900', cursor: 'pointer', color: '#475569' };
const titleStyle = { fontSize: '2.8rem', fontWeight: '950', color: '#064e3b', margin: 0 };
const subTitleStyle = { margin: 0, color: '#94a3b8', fontWeight: 'bold', fontSize: '0.9rem' };
const listContainer = { display: 'flex', flexDirection: 'column', gap: '18px' };
const historyRow = { display: 'flex', alignItems: 'center', gap: '25px', background: 'white', padding: '20px', borderRadius: '32px', cursor: 'pointer', border: '2px solid #f1f5f9' };
const thumbStyle = { width: '100px', height: '100px', borderRadius: '22px', objectFit: 'cover' };
const thumbWrapper = { position: 'relative' };
const textStack = { flex: 1, textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '6px' };
const row1 = { display: 'flex', justifyContent: 'space-between', alignItems: 'center' };
const plantNameLabel = { fontSize: '1.25rem', color: '#1e293b', fontWeight: '900' };
const dateStyle = { fontSize: '0.8rem', color: '#94a3b8', fontWeight: '800' };
const row2 = { color: '#10b981', fontWeight: '900', fontSize: '0.9rem', textTransform: 'uppercase' };
const row3 = { fontSize: '0.95rem', color: '#64748b', maxWidth: '500px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' };
const actionGroup = { display: 'flex', alignItems: 'center', gap: '15px' };
const deleteBtnStyle = { background: 'none', border: 'none', color: '#cbd5e1', cursor: 'pointer' };
const startScanBtn = { marginTop: '20px', background: '#10b981', color: 'white', border: 'none', padding: '15px 30px', borderRadius: '15px', fontWeight: 'bold' };
const emptyStateStyle = { textAlign: 'center', padding: '100px 0', background: '#f8fafc', borderRadius: '40px', border: '2px dashed #e2e8f0' };
const overlay = { position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.85)', backdropFilter: 'blur(15px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' };
const modal = { background: 'white', width: '100%', maxWidth: '850px', maxHeight: '90vh', borderRadius: '50px', overflow: 'hidden', display: 'flex', flexDirection: 'column' };
const scrollableReportContent = { padding: '35px', overflowY: 'auto', flex: 1 };
const detailHeaderGrid = { display: 'grid', gridTemplateColumns: '320px 1fr', gap: '40px', marginBottom: '40px' };
const detailImgWrapper = { position: 'relative' };
const detailMainImg = { width: '100%', height: '320px', borderRadius: '35px', objectFit: 'cover' };
const confidenceOverlay = { position: 'absolute', bottom: '20px', left: '20px', background: 'white', padding: '8px 16px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: '900', display: 'flex', alignItems: 'center', gap: '5px' };
const detailTitleStack = { display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '15px' };
const detailPlantTitle = { fontSize: '2.8rem', fontWeight: '950', color: '#1e293b', margin: 0 };
const motivationCard = { background: '#f0fdf4', padding: '20px', borderRadius: '25px', border: '1px solid #dcfce7' };
const motivationText = { margin: 0, fontSize: '0.95rem', color: '#166534', fontWeight: '700' };
const modalActions = { display: 'flex', gap: '15px', padding: '35px', background: '#f8fafc', borderTop: '1px solid #e2e8f0' };
const pdfBtn = { flex: 1, background: '#1e293b', color: 'white', border: 'none', padding: '20px', borderRadius: '20px', fontWeight: '950', cursor: 'pointer' };
const closeBtn = { background: '#f1f5f9', color: '#475569', border: 'none', padding: '20px 40px', borderRadius: '20px', fontWeight: '900' };

export default History;