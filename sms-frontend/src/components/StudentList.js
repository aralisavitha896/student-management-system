import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function StudentList({ user }) {
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDept, setFilterDept] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'id', direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const studentsPerPage = 4;

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = () => {
    axios.get('http://localhost:8080/api/students')
      .then(response => setStudents(response.data))
      .catch(error => console.error(error));
  };

  const deleteStudent = (id) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      axios.delete(`http://localhost:8080/api/students/${id}`)
        .then(() => {
          loadStudents();
          setCurrentPage(1);
        })
        .catch(error => alert("Error: " + error.message));
    }
  };

  const getDeptCount = (deptName) => {
    return students.filter(s => s.department === deptName).length;
  };
  
  const getYearCount = (year) => {
    return students.filter(s => s.academicYear === year || s.academicYear === year.toString()).length;
  };

  let processedStudents = students.filter(student => {
    if (user.role === 'STUDENT' && student.id !== user.id) return false;

    const matchesSearch = 
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.rollNumber.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDept = filterDept === '' || (student.department && student.department === filterDept);
    
    return matchesSearch && matchesDept;
  });

  processedStudents.sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
    if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  const currentStudents = processedStudents.slice(indexOfFirstStudent, indexOfLastStudent);
  const totalPages = Math.ceil(processedStudents.length / studentsPerPage);

  return (
    <div>
      {/* Admin Stats Dashboard */}
      {user.role === 'ADMIN' && (
        <div style={{ marginBottom: '30px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Top Row: Main Totals */}
          <div style={{ display: 'flex', gap: '20px' }}>
            <div style={{ background: '#4f46e5', color: 'white', padding: '20px', borderRadius: '10px', flex: 1, boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
              <h3 style={{ margin: 0, fontSize: '16px', opacity: 0.9 }}>Total Students</h3>
              <p style={{ fontSize: '32px', fontWeight: 'bold', margin: '10px 0 0 0' }}>{students.length}</p>
            </div>
            <div style={{ background: '#10b981', color: 'white', padding: '20px', borderRadius: '10px', flex: 1, boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
              <h3 style={{ margin: 0, fontSize: '16px', opacity: 0.9 }}>Departments</h3>
              <p style={{ fontSize: '32px', fontWeight: 'bold', margin: '10px 0 0 0' }}>4</p>
            </div>
          </div>

          {/* Middle Row: Dept Counts */}
          <div style={{ display: 'flex', gap: '15px' }}>
            {['CS', 'IT', 'Mechanical', 'E&C'].map(dept => (
              <div key={dept} style={{ background: 'white', border: '1px solid #e5e7eb', padding: '15px', borderRadius: '8px', flex: 1, textAlign: 'center' }}>
                <h4 style={{ margin: 0, color: '#6b7280', fontSize: '14px' }}>{dept}</h4>
                <p style={{ margin: '5px 0 0 0', fontSize: '20px', fontWeight: 'bold', color: '#111827' }}>{getDeptCount(dept)}</p>
              </div>
            ))}
          </div>

          {/* Bottom Row: Year-wise Distribution */}
          <div style={{ background: '#f9fafb', padding: '20px', borderRadius: '12px', border: '1px solid #f3f4f6' }}>
            <h4 style={{ margin: '0 0 15px 0', fontSize: '14px', color: '#374151', fontWeight: 'bold' }}>Year-wise Distribution</h4>
            <div style={{ display: 'flex', gap: '10px' }}>
              {[1, 2, 3, 4].map(year => (
                <div key={year} style={{ flex: 1 }}>
                  <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '5px' }}>Year {year}</div>
                  <div style={{ background: '#e5e7eb', height: '8px', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ 
                      background: '#6366f1', 
                      height: '100%', 
                      width: `${students.length > 0 ? (getYearCount(year) / students.length) * 100 : 0}%`,
                      transition: 'width 0.5s ease'
                    }}></div>
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: 'bold', marginTop: '5px' }}>{getYearCount(year)} Students</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      
      {/* Header Section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <h2 style={{ margin: 0, fontSize: '24px', color: '#374151' }}>
             {user.role === 'ADMIN' ? 'Admin Dashboard' : 'My Profile'}
          </h2>
          
          
        </div>
        
      </div>

      {/* Admin Filter Panel */}
      {user.role === 'ADMIN' && (
          <div className="control-panel">
            <input 
              type="text" 
              className="custom-input" 
              placeholder="Search by name or email..." 
              value={searchTerm} 
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }} 
            />
            <select 
              className="custom-select" 
              value={filterDept} 
              onChange={(e) => { setFilterDept(e.target.value); setCurrentPage(1); }}
            >
              <option value="">All Departments</option>
              <option value="CS">CS</option>
              <option value="IT">IT</option>
              <option value="Mechanical">Mechanical</option>
              <option value="E&C">E&C</option>
            </select>
          </div>
      )}
      
      <table className="custom-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Roll No</th>
            <th>Email</th>
            <th>Dept</th>
            <th>Actions</th> 
          </tr>
        </thead>
        <tbody>
          {currentStudents.length > 0 ? currentStudents.map(student => (
            <tr key={student.id}>
              <td>{student.id}</td>
              <td><strong>{student.name}</strong></td>
              <td>{student.rollNumber}</td>
              <td>{student.email}</td>
              <td>{student.department}</td>
              <td>
                <Link to={`/edit/${student.id}`}>
                  <button className="btn btn-edit">
                    {user.role === 'ADMIN' ? 'Edit' : 'Update Profile'}
                  </button>
                </Link>
                {user.role === 'ADMIN' && (
                    <button className="btn btn-delete" onClick={() => deleteStudent(student.id)}>
                        Delete
                    </button>
                )}
              </td>
            </tr>
          )) : (
            <tr><td colSpan="6" style={{textAlign: 'center', padding: '20px'}}>No students found.</td></tr>
          )}
        </tbody>
      </table>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="pagination-controls">
          <button 
            className="btn btn-page" 
            disabled={currentPage === 1} 
            onClick={() => setCurrentPage(currentPage - 1)}
          >Previous</button>
          <span>Page {currentPage} of {totalPages}</span>
          <button 
            className="btn btn-page" 
            disabled={currentPage === totalPages} 
            onClick={() => setCurrentPage(currentPage + 1)}
          >Next</button>
        </div>
      )}
    </div>
  );
}

export default StudentList;