import React, { useState, useEffect } from 'react';
import api from '../api';

function FacultyDashboard({ user }) {
  const [records, setRecords] = useState([]);
  const [errors, setErrors] = useState({});
  const [savingId, setSavingId] = useState(null);

  useEffect(() => {
    // Fetch all student enrollments for this faculty's subjects
    api.get(`/api/academic/faculty/${user.email}`)
      .then(res => setRecords(res.data))
      .catch(err => console.error(err));
  }, [user.email]);

  const validateRecord = (record, index) => {
    let tempErrors = { ...errors };
    let recordErrors = {};

    if (record.attendedClasses < 0 || record.attendedClasses > record.totalClasses) {
      recordErrors.attendedClasses = `Must be 0-${record.totalClasses}`;
    }
    if (record.internalMarks < 0 || record.internalMarks > 30) {
      recordErrors.internalMarks = "Must be 0-30";
    }
    if (record.semesterMarks < 0 || record.semesterMarks > 70) {
      recordErrors.semesterMarks = "Must be 0-70";
    }

    tempErrors[index] = recordErrors;
    setErrors(tempErrors);
    return Object.keys(recordErrors).length === 0;
  };

  const handleSave = (record, index) => {
    if (!validateRecord(record, index)) {
        alert("Please fix the validation errors before saving.");
        return;
    }

    setSavingId(record.enrollmentId);
    api.post('/api/academic/update-performance', record)
      .then(() => {
          // Re-fetch to get updated grades
          api.get(`/api/academic/faculty/${user.email}`)
            .then(res => {
                setRecords(res.data);
                setSavingId(null);
            });
      })
      .catch(err => {
          alert("Error saving: " + err.message);
          setSavingId(null);
      });
  };

  const handleInputChange = (index, field, value) => {
    const updatedRecords = [...records];
    updatedRecords[index][field] = value === '' ? 0 : Number(value);
    setRecords(updatedRecords);
    
    // Clear error for this field as they type
    if (errors[index]?.[field]) {
        const newErrors = { ...errors };
        delete newErrors[index][field];
        setErrors(newErrors);
    }
  };

  return (
    <div className="dashboard-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <div>
            <h2 style={{ margin: 0, color: '#111827', fontSize: '28px' }}>Faculty Grading Portal</h2>
            <p style={{ margin: '5px 0 0 0', color: '#6b7280' }}>Manage student performance and attendance for your subjects.</p>
          </div>
          <div style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)', color: 'white', padding: '15px 25px', borderRadius: '15px', boxShadow: '0 10px 15px -3px rgba(79, 70, 229, 0.2)' }}>
              <div style={{ fontSize: '12px', opacity: 0.8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Enrolled Students</div>
              <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{records.length}</div>
          </div>
      </div>

      <div style={{ background: '#fff', borderRadius: '20px', padding: '25px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)', border: '1px solid #f3f4f6' }}>
          <table className="custom-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Subject</th>
                <th>Attendance</th>
                <th>Internals (Max 30)</th>
                <th>Semester (Max 70)</th>
                <th>Grade</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {records.map((r, index) => (
                <tr key={r.enrollmentId}>
                  <td>
                    <strong>{r.studentName}</strong><br/>
                    <span style={{ fontSize: '12px', color: '#666' }}>{r.studentRollNumber}</span>
                  </td>
                  <td>
                    <strong>{r.subjectName}</strong><br/>
                    <span style={{ fontSize: '12px', color: '#666' }}>{r.subjectCode}</span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <input type="number" 
                            className={`custom-input ${errors[index]?.attendedClasses ? 'input-error' : ''}`}
                            style={{ width: '70px', padding: '5px' }}
                            value={r.attendedClasses} 
                            onChange={(e) => handleInputChange(index, 'attendedClasses', e.target.value)} 
                            />
                            <span style={{ fontSize: '12px', marginLeft: '5px' }}>/ {r.totalClasses}</span>
                        </div>
                        {errors[index]?.attendedClasses && <span className="error-text" style={{ fontSize: '10px' }}>{errors[index].attendedClasses}</span>}
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <input type="number" 
                        className={`custom-input ${errors[index]?.internalMarks ? 'input-error' : ''}`}
                        style={{ width: '70px', padding: '5px' }}
                        value={r.internalMarks} 
                        onChange={(e) => handleInputChange(index, 'internalMarks', e.target.value)} 
                        />
                        {errors[index]?.internalMarks && <span className="error-text" style={{ fontSize: '10px' }}>{errors[index].internalMarks}</span>}
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <input type="number" 
                        className={`custom-input ${errors[index]?.semesterMarks ? 'input-error' : ''}`}
                        style={{ width: '70px', padding: '5px' }}
                        value={r.semesterMarks} 
                        onChange={(e) => handleInputChange(index, 'semesterMarks', e.target.value)} 
                        />
                        {errors[index]?.semesterMarks && <span className="error-text" style={{ fontSize: '10px' }}>{errors[index].semesterMarks}</span>}
                    </div>
                  </td>
                  <td><span style={{ padding: '5px 10px', background: '#e0e7ff', color: '#4f46e5', borderRadius: '5px', fontWeight: 'bold' }}>{r.grade || 'N/A'}</span></td>
                  <td>
                    <button 
                        className="btn btn-add" 
                        style={{ padding: '6px 12px', fontSize: '12px', background: savingId === r.enrollmentId ? '#9ca3af' : '#10b981' }}
                        onClick={() => handleSave(r, index)}
                        disabled={savingId === r.enrollmentId}
                    >
                        {savingId === r.enrollmentId ? 'Saving...' : 'Save'}
                    </button>
                  </td>
                </tr>
              ))}
              {records.length === 0 && (
                <tr>
                    <td colSpan="7" style={{ textAlign: 'center', padding: '40px', color: '#9ca3af' }}>No enrolled students found.</td>
                </tr>
              )}
            </tbody>
          </table>
      </div>
    </div>
  );
}

export default FacultyDashboard;