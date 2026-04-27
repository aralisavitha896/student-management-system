import React, { useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';

function AddStudent() {
  const navigate = useNavigate();
  
  const [student, setStudent] = useState({
    name: '', rollNumber: '', email: '', phoneNumber: '', department: '', academicYear: '', address: ''
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    let tempErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{10}$/;

    if (!student.name) tempErrors.name = "Name is required";
    if (!student.rollNumber) tempErrors.rollNumber = "Roll Number is required";
    
    if (!student.email) {
      tempErrors.email = "Email is required";
    } else if (!emailRegex.test(student.email)) {
      tempErrors.email = "Invalid email format";
    }

    if (student.phoneNumber && !phoneRegex.test(student.phoneNumber)) {
      tempErrors.phoneNumber = "Phone number must be 10 digits";
    }

    if (!student.department) tempErrors.department = "Department is required";
    if (!student.academicYear) tempErrors.academicYear = "Academic Year is required";

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleChange = (e) => {
    setStudent({ ...student, [e.target.name]: e.target.value });
    // Clear error when user starts typing
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: null });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    api.post('/api/students', student)
      .then(response => {
        alert("Student Added Successfully!");
        navigate('/');
      })
      .catch(error => {
        console.error(error);
        alert("Error adding student: " + (error.response?.data || error.message));
      });
  };

  return (
    <div className="dashboard-container">
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h2 style={{ fontSize: '28px', color: '#111827' }}>Add New Student</h2>
        <p style={{ color: '#6b7280' }}>Fill in the details to register a new student in the system.</p>
      </div>

      <div className="form-card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input 
              className={`custom-input ${errors.name ? 'input-error' : ''}`}
              style={{ width: '100%' }}
              type="text" 
              name="name" 
              placeholder="e.g. John Doe" 
              onChange={handleChange} 
            />
            {errors.name && <span className="error-text">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label>Roll Number</label>
            <input 
              className={`custom-input ${errors.rollNumber ? 'input-error' : ''}`}
              style={{ width: '100%' }}
              type="text" 
              name="rollNumber" 
              placeholder="e.g. CS101" 
              onChange={handleChange} 
            />
            {errors.rollNumber && <span className="error-text">{errors.rollNumber}</span>}
          </div>

          <div className="form-group">
            <label>Email Address</label>
            <input 
              className={`custom-input ${errors.email ? 'input-error' : ''}`}
              style={{ width: '100%' }}
              type="email" 
              name="email" 
              placeholder="e.g. john@example.com" 
              onChange={handleChange} 
            />
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label>Phone Number</label>
            <input 
              className={`custom-input ${errors.phoneNumber ? 'input-error' : ''}`}
              style={{ width: '100%' }}
              type="text" 
              name="phoneNumber" 
              placeholder="10 digit number" 
              onChange={handleChange} 
            />
            {errors.phoneNumber && <span className="error-text">{errors.phoneNumber}</span>}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div className="form-group">
              <label>Department</label>
              <select 
                name="department" 
                onChange={handleChange} 
                className={`custom-select ${errors.department ? 'input-error' : ''}`}
                style={{ width: '100%' }}
              >
                <option value="">Select Department</option>
                <option value="CS">CS</option>
                <option value="IT">IT</option>
                <option value="Mechanical">Mechanical</option>
                <option value="E&C">E&C</option>
              </select>
              {errors.department && <span className="error-text">{errors.department}</span>}
            </div>

            <div className="form-group">
              <label>Academic Year</label>
              <select 
                name="academicYear" 
                onChange={handleChange} 
                className={`custom-select ${errors.academicYear ? 'input-error' : ''}`}
                style={{ width: '100%' }}
              >
                <option value="">Select Year</option>
                <option value="1">1st Year</option>
                <option value="2">2nd Year</option>
                <option value="3">3rd Year</option>
                <option value="4">4th Year</option>
              </select>
              {errors.academicYear && <span className="error-text">{errors.academicYear}</span>}
            </div>
          </div>

          <div className="form-group">
            <label>Address</label>
            <input 
              className="custom-input" 
              style={{ width: '100%' }}
              type="text" 
              name="address" 
              placeholder="Residential Address" 
              onChange={handleChange} 
            />
          </div>

          <button type="submit" className="btn btn-add" style={{ width: '100%', marginTop: '10px', padding: '12px', fontSize: '16px' }}>
            Register Student
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddStudent;