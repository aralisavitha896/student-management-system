import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

function EditStudent({ user }) { // 1. Added user prop
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [student, setStudent] = useState({
    name: '', rollNumber: '', email: '', phoneNumber: '', department: '', academicYear: '', address: ''
  });

  useEffect(() => {
    axios.get(`http://localhost:8080/api/students/${id}`)
      .then(response => {
        setStudent(response.data);
      })
      .catch(error => console.error(error));
  }, [id]);

  const handleChange = (e) => {
    setStudent({ ...student, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // 2. Logic: Use different endpoints based on the Role
    const url = user.role === 'ADMIN' 
      ? `http://localhost:8080/api/students/${id}` 
      : `http://localhost:8080/api/students/${id}/profile`;

    axios.put(url, student)
      .then(() => {
        alert(user.role === 'ADMIN' ? "Student Updated Successfully!" : "Profile Updated Successfully!");
        navigate('/');
      })
      .catch(error => alert("Update failed: " + error.message));
  };

  return (
    <div className="dashboard-container" style={{maxWidth: '500px'}}>
      <h2>{user.role === 'ADMIN' ? 'Edit Student Details' : 'Update My Profile'}</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        
        {/* 3. Fields only Admin can see/edit */}
        {user.role === 'ADMIN' && (
          <>
            <label>Full Name:</label>
            <input className="custom-input" type="text" name="name" value={student.name} onChange={handleChange} required />
            
            <label>Roll Number:</label>
            <input className="custom-input" type="text" name="rollNumber" value={student.rollNumber} onChange={handleChange} required />
            
            <label>Department:</label>
            <input className="custom-input" type="text" name="department" value={student.department} onChange={handleChange} />
            
            <label>Academic Year:</label>
            <input className="custom-input" type="text" name="academicYear" value={student.academicYear} onChange={handleChange} />
          </>
        )}

        {/* 4. Fields both Admin and Student can edit */}
        <label>Email Address:</label>
        <input className="custom-input" type="email" name="email" value={student.email} onChange={handleChange} required />
        
        <label>Phone Number:</label>
        <input className="custom-input" type="text" name="phoneNumber" value={student.phoneNumber} onChange={handleChange} />
        
        <label>Address:</label>
        <input className="custom-input" type="text" name="address" value={student.address} onChange={handleChange} />
        
        <button type="submit" className="btn btn-edit" style={{ padding: '12px', marginTop: '10px' }}>
          {user.role === 'ADMIN' ? 'Save Changes' : 'Update Profile'}
        </button>
      </form>
    </div>
  );
}

export default EditStudent;