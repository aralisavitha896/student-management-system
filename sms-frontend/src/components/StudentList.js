import React, { useState, useEffect } from 'react';
import api from '../api';
import { Link } from 'react-router-dom';

function StudentList({ user }) {
  const [students, setStudents] = useState([]);
  const [academicRecords, setAcademicRecords] = useState([]); // Real data state
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDept, setFilterDept] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'id', direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const studentsPerPage = 4;

  useEffect(() => {
    loadStudents();
    if (user.role === 'STUDENT') {
      loadAcademicRecords();
    }
  }, [user]);

  const loadStudents = () => {
    api.get('/api/students')
      .then(response => setStudents(response.data))
      .catch(error => console.error(error));
  };

  const loadAcademicRecords = () => {
    api.get(`/api/academic/records/${user.id}`)
      .then(response => setAcademicRecords(response.data))
      .catch(error => console.error("Error loading academic records", error));
  };

  const deleteStudent = (id) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      api.delete(`/api/students/${id}`)
        .then(() => {
          loadStudents();
          setCurrentPage(1);
        })
        .catch(error => alert("Error: " + error.message));
    }
  };

  const getDeptCount = (deptName) => students.filter(s => s.department === deptName).length;
  
  const getYearCount = (year) => students.filter(s => s.academicYear === year || s.academicYear === year.toString()).length;

  let processedStudents = students.filter(student => {
    if (user.role === 'STUDENT' && student.id !== user.id) return false;
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
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

  const currentStudents = processedStudents.slice((currentPage - 1) * studentsPerPage, currentPage * studentsPerPage);
  const totalPages = Math.ceil(processedStudents.length / studentsPerPage);

  return (
    <div>
      {/* 1. ADMIN DASHBOARD STATS */}
      {user.role === 'ADMIN' && (
        <div style={{ marginBottom: '30px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', gap: '20px' }}>
            <div style={{ background: '#4f46e5', color: 'white', padding: '20px', borderRadius: '10px', flex: 1 }}>
              <h3>Total Students</h3>
              <p style={{ fontSize: '32px', fontWeight: 'bold' }}>{students.length}</p>
            </div>
            <div style={{ background: '#10b981', color: 'white', padding: '20px', borderRadius: '10px', flex: 1 }}>
              <h3>Departments</h3>
              <p style={{ fontSize: '32px', fontWeight: 'bold' }}>4</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '15px' }}>
            {['CS', 'IT', 'Mechanical', 'E&C'].map(dept => (
              <div key={dept} style={{ background: 'white', border: '1px solid #e5e7eb', padding: '15px', borderRadius: '8px', flex: 1, textAlign: 'center' }}>
                <h4 style={{ color: '#6b7280' }}>{dept}</h4>
                <p style={{ fontSize: '20px', fontWeight: 'bold' }}>{getDeptCount(dept)}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. TITLE SECTION */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ margin: 0, color: '#374151' }}>
           {user.role === 'ADMIN' ? 'Admin Dashboard' : 'My Profile'}
        </h2>
      </div>

      {/* 3. MAIN CONTENT: STUDENT CARD vs ADMIN TABLE */}
      {user.role === 'STUDENT' ? (
        <>
          {/* Profile Card */}
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
            <div style={{ background: 'white', width: '400px', borderRadius: '15px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', overflow: 'hidden', border: '1px solid #e5e7eb' }}>
              <div style={{ background: '#4f46e5', padding: '30px', textAlign: 'center' }}>
                <div style={{ width: '80px', height: '80px', background: 'white', borderRadius: '50%', margin: '0 auto 15px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '30px', color: '#4f46e5' }}>
                  {processedStudents[0]?.name?.charAt(0)}
                </div>
                <h3 style={{ color: 'white', margin: 0 }}>{processedStudents[0]?.name}</h3>
                <p style={{ color: '#c7d2fe' }}>Roll No: {processedStudents[0]?.rollNumber}</p>
              </div>
              <div style={{ padding: '20px' }}>
                <p><strong>Email:</strong> {processedStudents[0]?.email}</p>
                <p><strong>Department:</strong> {processedStudents[0]?.department}</p>
                <Link to={`/edit/${processedStudents[0]?.id}`}>
                  <button className="btn btn-edit" style={{ width: '100%', marginTop: '10px' }}>Update Profile</button>
                </Link>
              </div>
            </div>
          </div>

          {/* Academic Summary Grid */}
          <div className="academic-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '30px' }}>
            <div style={{ background: '#fff', padding: '20px', borderRadius: '15px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', border: '1px solid #eee' }}>
              <h4 style={{ marginBottom: '15px' }}>Subject-wise Attendance</h4>
              {academicRecords.length > 0 ? academicRecords.map(record => (
                <div key={record.id} style={{ marginBottom: '15px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                    <span>Subject ID: {record.subjectId}</span>
                    <span><strong>{((record.attendedClasses / record.totalClasses) * 100).toFixed(1)}%</strong></span>
                  </div>
                  <div style={{ background: '#e5e7eb', height: '8px', borderRadius: '10px', marginTop: '5px' }}>
                    <div style={{ width: `${(record.attendedClasses / record.totalClasses) * 100}%`, background: '#10b981', height: '100%', borderRadius: '10px' }}></div>
                  </div>
                </div>
              )) : <p style={{ color: '#6b7280' }}>No attendance data available.</p>}
            </div>

            <div style={{ background: '#fff', padding: '20px', borderRadius: '15px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', border: '1px solid #eee', textAlign: 'center' }}>
              <h4>Academic Performance</h4>
              <div style={{ margin: '20px 0' }}>
                 <p style={{ color: '#6b7280', fontSize: '14px' }}>Current Grade Average</p>
                 <h2 style={{ fontSize: '48px', color: '#4f46e5', margin: '10px 0' }}>
                   {academicRecords.length > 0 ? (academicRecords.reduce((acc, curr) => acc + curr.totalMarks, 0) / (academicRecords.length * 10)).toFixed(2) : "N/A"}
                 </h2>
              </div>
              <p style={{ fontSize: '12px', color: '#10b981' }}>● Overall Standing: Good</p>
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Admin Table View */}
          <div className="control-panel">
            <input type="text" className="custom-input" placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            <select className="custom-select" value={filterDept} onChange={(e) => setFilterDept(e.target.value)}>
              <option value="">All Departments</option>
              <option value="CS">CS</option>
              <option value="IT">IT</option>
              <option value="Mechanical">Mechanical</option>
              <option value="E&C">E&C</option>
            </select>
          </div>
          <table className="custom-table">
            <thead>
              <tr><th>ID</th><th>Name</th><th>Roll No</th><th>Email</th><th>Dept</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {currentStudents.map(student => (
                <tr key={student.id}>
                  <td>{student.id}</td>
                  <td><strong>{student.name}</strong></td>
                  <td>{student.rollNumber}</td>
                  <td>{student.email}</td>
                  <td>{student.department}</td>
                  <td>
                    <Link to={`/edit/${student.id}`}><button className="btn btn-edit">Edit</button></Link>
                    <button className="btn btn-delete" onClick={() => deleteStudent(student.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="pagination-controls">
            <button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>Prev</button>
            <span>Page {currentPage} of {totalPages}</span>
            <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)}>Next</button>
          </div>
        </>
      )}
    </div>
  );
}

export default StudentList;