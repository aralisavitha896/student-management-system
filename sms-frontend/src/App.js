import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import StudentList from './components/StudentList';
import AddStudent from './components/AddStudent';
import EditStudent from './components/EditStudent';
import Login from './components/Login';
import ChangePassword from './components/ChangePassword';
import FacultyDashboard from './components/FacultyDashboard'; // Ensure this is created
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser && savedUser !== "null" && savedUser !== "undefined") {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error("Failed to parse user", e);
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    window.location.href = "/";
  };

  if (loading) return <div className="dashboard-container">Loading...</div>;

  return (
    <Router>
      <div className="dashboard-container">
        {/* Navigation Bar */}
        <nav className="navbar">
          <h1>Student Management System</h1>
          <div className="nav-links">
            {user && (
              <>
                <Link to="/" style={{ background: '#10b981', color: 'white', padding: '5px 12px', borderRadius: '5px', marginLeft: '15px', textDecoration: 'none', fontSize: '14px', fontWeight: 'bold' }}>Dashboard</Link>
                
                {user.role === 'ADMIN' && (
                  <Link to="/add" style={{ background: '#10b981', color: 'white', padding: '5px 12px', borderRadius: '5px', marginLeft: '15px', textDecoration: 'none', fontSize: '14px', fontWeight: 'bold' }}>+ Add Student</Link>
                )}
                
                <Link to="/change-password" style={{ background: '#10b981', color: 'white', padding: '5px 12px', borderRadius: '5px', marginLeft: '15px', textDecoration: 'none', fontSize: '14px', fontWeight: 'bold' }}>Settings</Link>
                
                <button onClick={handleLogout} style={{ background: '#f85b5b', color: 'white', padding: '5px 12px', borderRadius: '5px', marginLeft: '15px', fontSize: '14px', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}>
                  Logout
                </button>
              </>
            )}
          </div>
        </nav>

        {/* The Routing Engine */}
        <Routes>
          {/* Public Route */}
          <Route path="/login" element={<Login setUser={setUser} />} />

          {/* Unified Role-Based Dashboard Route */}
          <Route 
            path="/" 
            element={
              !user ? <Navigate to="/login" replace /> :
              user.role === 'ADMIN' ? <StudentList user={user} /> :
              user.role === 'FACULTY' ? <FacultyDashboard user={user} /> :
              user.role === 'STUDENT' ? <StudentList user={user} /> :
              <Navigate to="/login" replace />
            } 
          />

          {/* Protected Routes */}
          <Route path="/add" element={user?.role === 'ADMIN' ? <AddStudent /> : <Navigate to="/" replace />} />
          <Route path="/edit/:id" element={user ? <EditStudent user={user} /> : <Navigate to="/login" replace />} />
          <Route path="/change-password" element={user ? <ChangePassword user={user} /> : <Navigate to="/login" replace />} />
          
          {/* Fallback Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;