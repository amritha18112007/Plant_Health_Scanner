// src/components/Login.js
import React, { useState } from 'react';
import axios from 'axios';
import './ComponentStyles.css'; 

const API_BASE_URL = 'http://127.0.0.1:8000/api/auth/'; 

function Login({ handleLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    const endpoint = isRegistering ? 'register/' : 'login/';
    
    try {
      const response = await axios.post(API_BASE_URL + endpoint, { 
        username, 
        password,
        email: `${username}@scanner.com` 
      });

      if (isRegistering) {
        setMessage('Account created! You can now login.');
        setIsRegistering(false);
      } else {
        handleLoginSuccess(response.data.user_id); 
      }
    } catch (error) {
      setMessage(`Error: ${error.response?.data?.error || 'Authentication failed.'}`);
    }
  };

  return (
    <div className="glass-card login-center">
      <div className="spatial-header">
        <h1 className="login-title">Welcome <span className="mint-text">Back.</span></h1>
        <p className="login-subtitle">Securely access your plant health dashboard.</p>
      </div>

      <form onSubmit={handleSubmit} className="login-form">
        <input
          className="glass-input"
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          className="glass-input"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="spatial-button">
          {isRegistering ? 'CREATE ACCOUNT' : 'LOG IN'}
        </button>
      </form>

      <div className="auth-footer">
        <p onClick={() => setIsRegistering(!isRegistering)} className="toggle-auth">
          {isRegistering ? 'Already have an account? Login' : "Don't have an account? Register"}
        </p>
        {message && <p className="status-msg">{message}</p>}
      </div>
    </div>
  );
}

export default Login;