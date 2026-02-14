import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Lock, Mail, MapPin, Sprout, ArrowRight, ShieldCheck, ClipboardList, Eye, EyeOff } from 'lucide-react';
import axios from 'axios';

const AuthPage = ({ setAuth }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '', password: '', confirmPassword: '', email: '', location: '', fullName: '', farmType: 'Home Garden'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submit Clicked! Mode:", isLogin ? 'Login' : 'Register'); // DEBUG LOG

    // 1. Validation Logic
    if (!isLogin && formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    const endpoint = isLogin ? 'login' : 'register';
    const apiUrl = `http://127.0.0.1:8000/api/${endpoint}/`;

    try {
      console.log("Sending request to:", apiUrl); // DEBUG LOG
      const res = await axios.post(apiUrl, formData);
      
      console.log("Server Response:", res.data); // DEBUG LOG

      if (isLogin) {
        // MUST save these so App.js knows who is logged in
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user_id', res.data.user_id);
        localStorage.setItem('username', res.data.username);
        localStorage.setItem('location', formData.location || 'Sankarnagar');
        localStorage.setItem('farmType', formData.farmType || 'Home Garden');
        
        setAuth(true); // Trigger App.js navigation
      } else {
        setIsLogin(true);
        alert("Registration successful! Please sign in.");
      }
    } catch (err) {
      console.error("Auth Error Object:", err); // DEBUG LOG
      alert("Auth failed: " + (err.response?.data?.error || "Cannot connect to server. Check Django logs."));
    }
  };

  return (
    <div style={pageStyle}>
      <motion.div layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={glassCardStyle}>
        <div style={{ textAlign: 'center', marginBottom: '35px' }}>
          <div style={iconCircleStyle}><Sprout size={32} /></div>
          <h2 style={{ fontSize: '2.2rem', fontWeight: '900', color: '#064e3b', margin: 0 }}>
            {isLogin ? 'Farmer Login' : 'Create Profile'}
          </h2>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {!isLogin && (
            <div style={inputContainerStyle}>
              <ClipboardList size={18} color="#10b981" />
              <input type="text" placeholder="Full Name" required style={inputStyle} onChange={(e) => setFormData({...formData, fullName: e.target.value})} />
            </div>
          )}

          <div style={inputContainerStyle}>
            <User size={18} color="#10b981" />
            <input type="text" placeholder="Username" required style={inputStyle} onChange={(e) => setFormData({...formData, username: e.target.value})} />
          </div>

          {!isLogin && (
            <>
              <div style={inputContainerStyle}><Mail size={18} color="#10b981" /><input type="email" placeholder="Email" required style={inputStyle} onChange={(e) => setFormData({...formData, email: e.target.value})} /></div>
              <div style={inputContainerStyle}><MapPin size={18} color="#10b981" /><input type="text" placeholder="Location" required style={inputStyle} onChange={(e) => setFormData({...formData, location: e.target.value})} /></div>
            </>
          )}

          <div style={inputContainerStyle}>
            <Lock size={18} color="#10b981" />
            <input 
              type={showPassword ? "text" : "password"} 
              placeholder="Password" 
              required 
              style={inputStyle} 
              onChange={(e) => setFormData({...formData, password: e.target.value})} 
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)} style={{background:'none', border:'none', cursor:'pointer'}}>
              {showPassword ? <EyeOff size={18} color="#94a3b8"/> : <Eye size={18} color="#94a3b8"/> }
            </button>
          </div>

          {!isLogin && (
            <div style={inputContainerStyle}>
              <ShieldCheck size={18} color="#10b981" />
              <input type="password" placeholder="Confirm Password" required style={inputStyle} onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})} />
            </div>
          )}

          <button type="submit" className="spatial-button" style={{ height: '60px', borderRadius: '20px', fontSize: '1.1rem', cursor: 'pointer' }}>
            {isLogin ? 'SIGN IN' : 'REGISTER'} <ArrowRight size={18} style={{marginLeft: '10px'}} />
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '25px', color: '#64748b' }}>
          <span onClick={() => setIsLogin(!isLogin)} style={{ color: '#10b981', fontWeight: '800', cursor: 'pointer', textDecoration: 'underline' }}>
            {isLogin ? 'Need an account? Register' : 'Already have an account? Login'}
          </span>
        </p>
      </motion.div>
    </div>
  );
};

// ... Styles (reuse previous styles) ...
const pageStyle = { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f0fdf4' };
const glassCardStyle = { width: '100%', maxWidth: '450px', background: 'white', padding: '40px', borderRadius: '30px', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' };
const iconCircleStyle = { background: '#10b981', width: '64px', height: '64px', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', color: 'white' };
const inputContainerStyle = { display: 'flex', alignItems: 'center', gap: '10px', border: '1px solid #e2e8f0', padding: '0 15px', borderRadius: '15px' };
const inputStyle = { width: '100%', border: 'none', padding: '15px 0', outline: 'none' };

export default AuthPage;