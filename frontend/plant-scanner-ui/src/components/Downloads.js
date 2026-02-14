import React from 'react';
import { motion } from 'framer-motion';
import { Download, FileSpreadsheet, FileText, ArrowLeft } from 'lucide-react';

const Downloads = ({ historyData, onBack }) => {
  const handleCSVExport = () => {
    if (!historyData || historyData.length === 0) return alert("No data to export.");
    const headers = ["ID,Plant Name,Result,Date"];
    const rows = historyData.map(h => `${h.id},${h.plant_name},"${h.recommendation?.split('|')[0]}",${h.date}`);
    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join("\n");
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", "PlantDoctor_History.csv");
    document.body.appendChild(link);
    link.click();
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <div style={headerRow}>
        <h1 style={pageTitle}>Downloads</h1>
        <button onClick={onBack} style={backBtn}><ArrowLeft size={18} /> Back to Hub</button>
      </div>

      <div style={contentCard}>
        <p style={bodyText}>Export your diagnostic archives for professional agricultural reporting and history tracking.</p>
        
        <div style={exportGrid}>
          <button onClick={handleCSVExport} style={exportBtn}>
            <FileSpreadsheet size={24} />
            <div style={{ textAlign: 'left' }}>
              <p style={btnLabel}>Export as CSV</p>
              <p style={btnSub}>Compatible with Excel</p>
            </div>
          </button>

          <button style={exportBtnDisabled}>
            <FileText size={24} />
            <div style={{ textAlign: 'left' }}>
              <p style={btnLabel}>Export as PDF</p>
              <p style={btnSub}>Coming Soon</p>
            </div>
          </button>
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
const exportGrid = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '30px' };
const exportBtn = { background: '#1e293b', border: 'none', padding: '30px', borderRadius: '25px', color: 'white', display: 'flex', gap: '15px', alignItems: 'center', cursor: 'pointer' };
const exportBtnDisabled = { ...exportBtn, background: '#f1f5f9', color: '#cbd5e1', cursor: 'not-allowed' };
const btnLabel = { margin: 0, fontWeight: '900', fontSize: '1.1rem' };
const btnSub = { margin: 0, fontSize: '0.8rem', opacity: 0.6 };

export default Downloads;