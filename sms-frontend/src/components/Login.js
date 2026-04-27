import React, { useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';

function Login({ setUser }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    api.post('/api/students/login', { 
      email: email, 
      password: password 
    })
      .then(res => {
        localStorage.setItem('user', JSON.stringify(res.data));
        setUser(res.data);
        navigate('/'); 
      })
      .catch((err) => {
        console.error(err);
        if (err.response && err.response.status === 401) {
          alert("Invalid Email or Password");
        } else {
          alert("Server Error: " + (err.response?.data?.message || err.message || "Unknown error"));
        }
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="dashboard-container" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <h1 style={{ fontSize: '36px', background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontWeight: '800' }}>
            EduStream SMS
        </h1>
        <p style={{ color: '#6b7280', fontSize: '16px' }}>Sign in to access your dashboard</p>
      </div>

      <div className="form-card" style={{ width: '400px', margin: '0' }}>
        <form onSubmit={handleLogin}>
          <div className="form-group">
              <label>Email Address</label>
              <input 
                  className="custom-input" 
                  style={{width: '100%'}} 
                  type="email" 
                  placeholder="e.g. name@example.com" 
                  onChange={e => setEmail(e.target.value)} 
                  autoComplete="new-password"
                  required 
              />
          </div>
          <div className="form-group" style={{ marginBottom: '25px' }}>
              <label>Password</label>
              <input 
                  className="custom-input" 
                  style={{width: '100%'}} 
                  type="password" 
                  placeholder="••••••••" 
                  onChange={e => setPassword(e.target.value)} 
                  autoComplete="new-password"
                  required 
              />
          </div>
          <button className="btn btn-add" type="submit" disabled={loading} style={{width: '100%', padding: '14px', fontSize: '16px', background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)'}}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
      
      <p style={{ marginTop: '20px', color: '#9ca3af', fontSize: '14px' }}>
        Forgot your password? Contact your administrator.
      </p>
    </div>
  );
}

export default Login;