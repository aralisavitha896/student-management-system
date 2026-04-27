import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import StudentList from './components/StudentList';
import AddStudent from './components/AddStudent';
import EditStudent from './components/EditStudent';
import Login from './components/Login';
import ChangePassword from './components/ChangePassword';
import FacultyDashboard from './components/FacultyDashboard'; 
import StudentAcademicDashboard from './components/StudentAcademicDashboard';
import './App.css';
import StaffDashboard from './components/StaffDashboard';
import AddSubject from './components/AddSubject';
import AddFaculty from './components/AddFaculty';
import FacultyList from './components/FacultyList';
import EnrollStudent from './components/EnrollStudent';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

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

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  if (loading) return <div className="dashboard-container">Loading...</div>;

  return (
    <Router>
      <div className="app-layout">
        {/* Sidebar */}
        {user && (
          <aside className={`sidebar ${isSidebarOpen ? '' : 'collapsed'}`}>
            <div className="sidebar-header">
              SMS Menu
            </div>
            <div className="sidebar-links">
              <Link to="/" onClick={() => !isSidebarOpen && setIsSidebarOpen(true)}>
                <span>🏠</span> Dashboard
              </Link>
              
              {user.role === 'ADMIN' && (
                <>
                  <Link to="/faculties">
                    <span>👥</span> View Faculties
                  </Link>
                  <Link to="/add">
                    <span>➕</span> Add Student
                  </Link>
                  <Link to="/add-subject">
                    <span>📚</span> Add Subject
                  </Link>
                  <Link to="/add-faculty">
                    <span>👨‍🏫</span> Add Faculty
                  </Link>
                  <Link to="/enroll">
                    <span>📝</span> Enroll Student
                  </Link>
                </>
              )}
              
              <Link to="/change-password">
                <span>⚙️</span> Settings
              </Link>
            </div>
          </aside>
        )}

        <div className="main-wrapper">
          {/* Top Bar */}
          <header className="top-bar">
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              {user && (
                <button className="toggle-btn" onClick={toggleSidebar} title="Menu">
                  ☰
                </button>
              )}
              <h1 style={{ margin: 0, fontSize: '24px', color: '#111827' }}>Student Management System</h1>
            </div>
            
            {user && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <span style={{ fontSize: '14px', color: '#6b7280' }}>{user.name} ({user.role})</span>
                <button onClick={handleLogout} className="btn" style={{ background: '#f85b5b' }}>
                  Logout
                </button>
              </div>
            )}
          </header>

          <main className="dashboard-container">
            <Routes>
              <Route path="/login" element={<Login setUser={setUser} />} />
              <Route 
                path="/" 
                element={
                  !user ? <Navigate to="/login" replace /> :
                  user.role === 'ADMIN' ? <StudentList user={user} /> :
                  user.role === 'FACULTY' ? <FacultyDashboard user={user} /> :
                  user.role === 'STUDENT' ? <StudentAcademicDashboard user={user} /> :
                  user.role === 'STAFF' ? <StaffDashboard user={user} /> :
                  <Navigate to="/login" replace />
                } 
              />
              <Route path="/add" element={user?.role === 'ADMIN' ? <AddStudent /> : <Navigate to="/" replace />} />
              <Route path="/edit/:id" element={user ? <EditStudent user={user} /> : <Navigate to="/login" replace />} />
              <Route path="/change-password" element={user ? <ChangePassword user={user} /> : <Navigate to="/login" replace />} />
              <Route path="/add-subject" element={user?.role === 'ADMIN' ? <AddSubject /> : <Navigate to="/" />} />
              <Route path="/add-faculty" element={user?.role === 'ADMIN' ? <AddFaculty /> : <Navigate to="/" />} />
              <Route path="/faculties" element={user?.role === 'ADMIN' ? <FacultyList /> : <Navigate to="/" />} />
              <Route path="/enroll" element={user?.role === 'ADMIN' ? <EnrollStudent /> : <Navigate to="/" />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;