import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LogOut, 
  History, 
  Camera, 
  Home, 
  X, 
  User, 
  Shield, 
  Info, 
  Sprout, 
  ChevronRight, 
  Download 
} from 'lucide-react';

const Sidebar = ({ isOpen, onClose, username, onNavigate, onLogout }) => {
  
  // Helper to handle navigation and auto-close the sidebar
  const handleNav = (target) => {
    onNavigate(target);
    onClose(); 
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            onClick={onClose} 
            style={overlayStyle} 
          />
          
          <motion.div 
            initial={{ x: '-100%' }} 
            animate={{ x: 0 }} 
            exit={{ x: '-100%' }} 
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            style={sidebarContainer}
          >
            
            <div style={sidebarHeader}>
              <div style={brandStyle}>
                <Sprout color="#10b981" size={24} /> 
                <span>Plant Doctor</span>
              </div>
              <motion.div whileTap={{ scale: 0.9 }}>
                <X onClick={onClose} style={{ cursor: 'pointer', color: '#94a3b8' }} />
              </motion.div>
            </div>

            <nav style={scrollableMenuArea}>
              {/* Primary Navigation */}
              <MenuBtn 
                icon={<Home size={18}/>} 
                label="Welcome Hub" 
                onClick={() => handleNav('home')} 
              />
              <MenuBtn 
                icon={<Camera size={18}/>} 
                label="Start Scan" 
                onClick={() => handleNav('main')} 
              />
              <MenuBtn 
                icon={<History size={18}/>} 
                label="Archives" 
                onClick={() => handleNav('history')} 
              />
              
              <div style={divider} />
              
              {/* Sub-Pages Section */}
              <MenuBtn 
                icon={<User size={18}/>} 
                label="User Profile" 
                onClick={() => handleNav('profile')} 
              />
              <MenuBtn 
                icon={<Shield size={18}/>} 
                label="Account Details" 
                onClick={() => handleNav('account')} 
              />
              <MenuBtn 
                icon={<Info size={18}/>} 
                label="About App" 
                onClick={() => handleNav('about')} 
              />
              <MenuBtn 
                icon={<Download size={18}/>} 
                label="Downloads" 
                onClick={() => handleNav('downloads')} 
              />
            </nav>

            <motion.button 
              whileHover={{ backgroundColor: '#7f1d1d' }}
              whileTap={{ scale: 0.98 }}
              onClick={onLogout} 
              style={logoutBtn}
            >
              <LogOut size={18} /> Logout Session
            </motion.button>
            
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const MenuBtn = ({ icon, label, onClick }) => (
    <motion.button 
      whileHover={{ x: 5, backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick} 
      style={navItemStyle}
    >
        <div style={{display:'flex', alignItems:'center', gap:'15px'}}>
          <div style={{ color: '#10b981' }}>{icon}</div>
          <span>{label}</span>
        </div>
        <ChevronRight size={14} style={{ opacity: 0.3 }} />
    </motion.button>
);

// --- STYLES ---
const sidebarContainer = { 
    position: 'fixed', left: 0, top: 0, height: '100vh', width: '300px', 
    background: '#1e293b', zIndex: 2000, display: 'flex', flexDirection: 'column', 
    color: 'white', padding: '40px 30px', boxShadow: '10px 0 50px rgba(0,0,0,0.5)'
};

const scrollableMenuArea = { 
    flex: 1, overflowY: 'auto', marginTop: '40px', display: 'flex', 
    flexDirection: 'column', gap: '8px', paddingRight: '10px'
};

const sidebarHeader = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '10px' };
const brandStyle = { display: 'flex', alignItems: 'center', gap: '12px', fontWeight: '900', fontSize: '1.25rem', letterSpacing: '-0.02em' };
const navItemStyle = { background: 'none', border: 'none', color: '#cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', padding: '16px', cursor: 'pointer', borderRadius: '16px', transition: 'background 0.2s ease', textAlign: 'left' };
const divider = { height: '1px', background: 'rgba(255,255,255,0.05)', margin: '20px 0' };
const logoutBtn = { marginTop: '20px', background: '#450a0a', color: '#f87171', border: 'none', padding: '20px', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', cursor: 'pointer', fontWeight: '800', fontSize: '0.95rem' };
const overlayStyle = { position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.8)', zIndex: 1999, backdropFilter: 'blur(8px)' };

export default Sidebar;