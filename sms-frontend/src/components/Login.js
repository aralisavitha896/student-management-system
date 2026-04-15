import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// 1. Receive setUser as a prop from App.js
function Login({ setUser }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    axios.post('http://localhost:8080/api/students/login', { 
      email: email, 
      password: password 
    })
      .then(res => {
        // 2. Save to localStorage so the session persists on refresh
        localStorage.setItem('user', JSON.stringify(res.data));
        
        // 3. Update the App state directly (This stops the flicker!)
        setUser(res.data);
        
        // 4. Navigate to the dashboard
        navigate('/'); 
        
        // REMOVED: window.location.reload() - This was causing the flicker
      })
      .catch((err) => {
        console.error(err);
        alert("Invalid Credentials");
      });
  };

  return (
    <div className="dashboard-container" style={{maxWidth: '400px', margin: '100px auto'}}>
      <h2>Login</h2>
      <form onSubmit={handleLogin} style={{display: 'flex', flexDirection: 'column', gap: '15px'}}>
        <div style={{display: 'flex', flexDirection: 'column', textAlign: 'left'}}>
            <label>Email Address</label>
            <input 
                className="custom-input" 
                style={{width: '100%'}} 
                type="email" 
                placeholder="e.g. mygmail@gmail.com" 
                onChange={e => setEmail(e.target.value)} 
                autoComplete="new-password" // Tricks Chrome into not autofilling
                required 
            />
        </div>
        <div style={{display: 'flex', flexDirection: 'column', textAlign: 'left'}}>
            <label>Password</label>
            <input 
                className="custom-input" 
                style={{width: '100%'}} 
                type="password" 
                placeholder="Enter Password" 
                onChange={e => setPassword(e.target.value)} 
                autoComplete="new-password" // Browsers rarely autofill "new" password fields
                required 
            />
        </div>
        <button className="btn btn-add" type="submit" style={{marginTop: '10px'}}>Login</button>
      </form>
    </div>
  );
}

export default Login;