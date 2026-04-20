import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import StudentList from './components/StudentList';
import AddStudent from './components/AddStudent';
import EditStudent from './components/EditStudent';
import Login from './components/Login';
import ChangePassword from './components/ChangePassword'; // Ensure this is imported
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
    setLoading(false); // CRITICAL: This allows the app to render after checking storage
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
            {/* 1. Only show the links IF a user is logged in. 
                  This removes the "Login" link from the top right on the login page. */}
            {user && (
              <>
                <Link to="/" style={{
                    background: '#10b981',
                    color: 'white',
                    padding: '5px 12px',
                    borderRadius: '5px',
                    marginLeft: '15px',
                    textDecoration: 'none',
                    fontSize: '14px',
                    fontWeight: 'bold'
                  }}>Dashboard</Link>
                
                {user.role === 'ADMIN' && (
                  <Link to="/add" style={{
                    background: '#10b981',
                    color: 'white',
                    padding: '5px 12px',
                    borderRadius: '5px',
                    marginLeft: '15px',
                    textDecoration: 'none',
                    fontSize: '14px',
                    fontWeight: 'bold'
                  }}>+ Add Student</Link>
                )}
                
                <Link to="/change-password" style={{
                    background: '#10b981',
                    color: 'white',
                    padding: '5px 12px',
                    borderRadius: '5px',
                    marginLeft: '15px',
                    textDecoration: 'none',
                    fontSize: '14px',
                    fontWeight: 'bold'
                  }}>Settings</Link>

                <button onClick={handleLogout} 
                  style={{
                    background: '#f85b5b',
                    color: 'white',
                    padding: '5px 12px',
                    borderRadius: '5px',
                    marginLeft: '15px',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    border: 'none',      // 2. FIXED: Removes the black border completely
                    cursor: 'pointer',
                    outline: 'none'
                  }}>
                  Logout
                </button>
              </>
            )}
          </div>
        </nav>
        <Route 
            path="/" 
            element={
              !user ? <Navigate to="/login" /> : // If not logged in, go to login
              user.role === 'ADMIN' ? <StudentList user={user} /> :
              user.role === 'FACULTY' ? <FacultyDashboard user={user} /> :
              user.role === 'STUDENT' ? <StudentList user={user} /> :
              <Navigate to="/login" />
            } 
          />
        {/* The Routes */}
        <Routes>
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/" element={user ? <StudentList user={user} /> : <Navigate to="/login" replace />} />
          <Route path="/add" element={user?.role === 'ADMIN' ? <AddStudent /> : <Navigate to="/login" replace />} />
          <Route path="/edit/:id" element={user ? <EditStudent user={user} /> : <Navigate to="/login" replace />} />
          <Route path="/change-password" element={user ? <ChangePassword user={user} /> : <Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;