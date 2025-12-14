// src/components/Login.js (Updated for design)
import React, { useState } from 'react';
import axios from 'axios';
import './ComponentStyles.css'; // We'll create this for component-specific styles

// Base URL for your Django Authentication APIs
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
        setMessage('Registration successful! Please log in.');
        setIsRegistering(false);
        setUsername('');
        setPassword('');
      } else {
        handleLoginSuccess(response.data.user_id); 
      }
    } catch (error) {
      setMessage(`Error: ${error.response?.data?.error || 'Could not connect to server or Invalid credentials.'}`);
    }
  };

  return (
    <div className="form-container"> {/* Use new class */}
      <h2>{isRegistering ? 'Create Account' : 'Welcome Back'}</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">
          {isRegistering ? 'Register' : 'Login'}
        </button>
      </form>
      <p className="switch-link">
        {isRegistering ? 'Already have an account? ' : "Don't have an account? "}
        <span onClick={() => {
            setIsRegistering(!isRegistering);
            setMessage('');
        }} className="link-button">
          {isRegistering ? 'Login' : 'Register'}
        </span>
      </p>
      {message && <p className={message.startsWith('Error') ? 'error-message' : 'success-message'}>{message}</p>}
    </div>
  );
}

export default Login;