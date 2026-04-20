import React, { useState, useEffect } from 'react';
import axios from 'axios';

function FacultyDashboard({ user }) {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    // Fetch all student enrollments for this faculty's subjects
    axios.get(`http://localhost:8080/api/academic/faculty/${user.email}`)
      .then(res => setRecords(res.data))
      .catch(err => console.error(err));
  }, [user.email]);

  const handleSave = (record) => {
    axios.post('http://localhost:8080/api/academic/update-performance', record)
      .then(() => console.log("Marks Updated!"))
      .catch(err => alert("Error saving: " + err.message));
  };

  return (
    <div className="card-container">
      <h2>Faculty Grading Portal</h2>
      <table className="custom-table">
        <thead>
          <tr>
            <th>Student ID</th>
            <th>Attendance</th>
            <th>Internals (30)</th>
            <th>Semester (70)</th>
            <th>Current Grade</th>
          </tr>
        </thead>
        <tbody>
          {records.map(r => (
            <tr key={r.id}>
              <td>{r.studentId}</td>
              <td>
                <input type="number" defaultValue={r.attendedClasses} 
                  onChange={(e) => r.attendedClasses = e.target.value} 
                  onBlur={() => handleSave(r)} />
              </td>
              <td>
                <input type="number" defaultValue={r.internalMarks} 
                  onChange={(e) => r.internalMarks = e.target.value} 
                  onBlur={() => handleSave(r)} />
              </td>
              <td>
                <input type="number" defaultValue={r.semesterMarks} 
                  onChange={(e) => r.semesterMarks = e.target.value} 
                  onBlur={() => handleSave(r)} />
              </td>
              <td><span className="badge">{r.grade || 'N/A'}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default FacultyDashboard;