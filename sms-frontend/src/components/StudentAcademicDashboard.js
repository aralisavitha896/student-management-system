import React, { useState, useEffect } from 'react';
import api from '../api';
import { Link } from 'react-router-dom';

function StudentAcademicDashboard({ user }) {
  const [enrollments, setEnrollments] = useState([]);
  const [studentDetails, setStudentDetails] = useState(null);

  useEffect(() => {
    // Load student profile details
    api.get(`/api/students/${user.id}`)
      .then(res => setStudentDetails(res.data))
      .catch(err => console.error(err));

    // Load academic records
    api.get(`/api/academic/student/${user.id}/enrollments`)
      .then(res => setEnrollments(res.data))
      .catch(err => console.error("Error loading academic records", err));
  }, [user.id]);

  // Calculate CGPA
  const calculateCGPA = () => {
    if (enrollments.length === 0) return 0.00;
    
    // Simple CGPA calculation based on grades (O=10, A+=9, A=8, B+=7, B=6, F=0)
    const gradePoints = { 'O': 10, 'A+': 9, 'A': 8, 'B+': 7, 'B': 6, 'F': 0 };
    
    let totalCredits = 0;
    let earnedPoints = 0;
    
    enrollments.forEach(e => {
      const credits = e.credits || 3; // default to 3 if not specified
      const points = gradePoints[e.grade] || 0;
      totalCredits += credits;
      earnedPoints += (points * credits);
    });
    
    if (totalCredits === 0) return 0.00;
    return (earnedPoints / totalCredits).toFixed(2);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ margin: 0, color: '#374151' }}>Student Academic Dashboard</h2>
      </div>

      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
        {/* Profile Summary Card */}
        <div style={{ background: 'white', flex: '1 1 300px', borderRadius: '15px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)', overflow: 'hidden', border: '1px solid #e5e7eb' }}>
          <div style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%)', padding: '30px', textAlign: 'center' }}>
            <div style={{ width: '80px', height: '80px', background: 'white', borderRadius: '50%', margin: '0 auto 15px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '30px', color: '#4f46e5', fontWeight: 'bold' }}>
              {studentDetails?.name?.charAt(0) || user?.name?.charAt(0)}
            </div>
            <h3 style={{ color: 'white', margin: 0 }}>{studentDetails?.name || user?.name}</h3>
            <p style={{ color: '#c7d2fe', marginTop: '5px' }}>Roll No: {studentDetails?.rollNumber || 'N/A'}</p>
          </div>
          <div style={{ padding: '20px' }}>
            <p style={{ margin: '10px 0', borderBottom: '1px solid #f3f4f6', paddingBottom: '10px' }}><strong>Email:</strong> {studentDetails?.email}</p>
            <p style={{ margin: '10px 0', borderBottom: '1px solid #f3f4f6', paddingBottom: '10px' }}><strong>Department:</strong> {studentDetails?.department}</p>
            <p style={{ margin: '10px 0', borderBottom: '1px solid #f3f4f6', paddingBottom: '10px' }}><strong>Phone:</strong> {studentDetails?.phoneNumber}</p>
            <Link to={`/edit/${user.id}`}>
              <button className="btn btn-edit" style={{ width: '100%', marginTop: '10px', background: '#f3f4f6', color: '#4b5563', border: '1px solid #d1d5db' }}>Update Profile</button>
            </Link>
          </div>
        </div>

        {/* Overview Stats */}
        <div style={{ flex: '2 1 500px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                <div style={{ background: 'white', padding: '25px', borderRadius: '15px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', border: '1px solid #e5e7eb', textAlign: 'center' }}>
                    <p style={{ color: '#6b7280', fontSize: '14px', margin: 0 }}>Total Subjects Enrolled</p>
                    <h2 style={{ fontSize: '42px', color: '#374151', margin: '10px 0' }}>{enrollments.length}</h2>
                </div>
                <div style={{ background: 'white', padding: '25px', borderRadius: '15px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', border: '1px solid #e5e7eb', textAlign: 'center' }}>
                    <p style={{ color: '#6b7280', fontSize: '14px', margin: 0 }}>Current CGPA</p>
                    <h2 style={{ fontSize: '42px', color: '#10b981', margin: '10px 0' }}>{calculateCGPA()}</h2>
                </div>
            </div>

            {/* Attendance Progress bars */}
            <div style={{ background: '#fff', padding: '25px', borderRadius: '15px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', border: '1px solid #e5e7eb' }}>
              <h4 style={{ margin: '0 0 20px 0', color: '#374151' }}>Subject-wise Attendance</h4>
              {enrollments.length > 0 ? enrollments.map(record => (
                <div key={record.enrollmentId} style={{ marginBottom: '15px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '8px' }}>
                    <span style={{ fontWeight: '500', color: '#4b5563' }}>{record.subjectName} ({record.subjectCode})</span>
                    <span style={{ fontWeight: 'bold', color: record.attendancePercentage >= 75 ? '#10b981' : '#ef4444' }}>
                        {record.attendancePercentage ? record.attendancePercentage.toFixed(1) : 0}%
                    </span>
                  </div>
                  <div style={{ background: '#e5e7eb', height: '10px', borderRadius: '10px' }}>
                    <div style={{ 
                        width: `${record.attendancePercentage || 0}%`, 
                        background: record.attendancePercentage >= 75 ? '#10b981' : '#ef4444', 
                        height: '100%', 
                        borderRadius: '10px',
                        transition: 'width 0.5s ease-in-out'
                    }}></div>
                  </div>
                </div>
              )) : <p style={{ color: '#6b7280', fontSize: '14px' }}>No enrolled subjects found.</p>}
            </div>
        </div>
      </div>

      {/* Detailed Marks Table */}
      <div style={{ background: '#fff', marginTop: '30px', padding: '25px', borderRadius: '15px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', border: '1px solid #e5e7eb' }}>
          <h4 style={{ margin: '0 0 20px 0', color: '#374151' }}>Academic Performance Details</h4>
          <table className="custom-table">
              <thead>
                  <tr>
                      <th>Subject</th>
                      <th>Credits</th>
                      <th>Internals (30)</th>
                      <th>Semester (70)</th>
                      <th>Total (100)</th>
                      <th>Grade</th>
                  </tr>
              </thead>
              <tbody>
                  {enrollments.map(r => {
                      const total = (r.internalMarks || 0) + (r.semesterMarks || 0);
                      return (
                        <tr key={r.enrollmentId}>
                            <td><strong>{r.subjectName}</strong> <br/><span style={{ fontSize: '12px', color: '#6b7280' }}>{r.subjectCode}</span></td>
                            <td>{r.credits}</td>
                            <td>{r.internalMarks}</td>
                            <td>{r.semesterMarks}</td>
                            <td style={{ fontWeight: 'bold' }}>{total}</td>
                            <td>
                                <span style={{ 
                                    padding: '5px 12px', 
                                    background: r.grade === 'F' ? '#fee2e2' : '#e0e7ff', 
                                    color: r.grade === 'F' ? '#ef4444' : '#4f46e5', 
                                    borderRadius: '5px', 
                                    fontWeight: 'bold' 
                                }}>
                                    {r.grade || 'N/A'}
                                </span>
                            </td>
                        </tr>
                      )
                  })}
                  {enrollments.length === 0 && (
                      <tr>
                          <td colSpan="6" style={{ textAlign: 'center', padding: '20px', color: '#6b7280' }}>No grade records available.</td>
                      </tr>
                  )}
              </tbody>
          </table>
      </div>

    </div>
  );
}

export default StudentAcademicDashboard;
