import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AddStudent() {
  const navigate = useNavigate(); // This helps us redirect after saving
  
  // State to hold form inputs
  const [student, setStudent] = useState({
    name: '', rollNumber: '', email: '', phoneNumber: '', department: '', academicYear: '', address: ''
  });

  // Handle typing in the input boxes
  const handleChange = (e) => {
    setStudent({ ...student, [e.target.name]: e.target.value });
  };

  // Handle the Submit button
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevents page reload
    axios.post('http://localhost:8080/api/students', student)
      .then(response => {
        alert("Student Added Successfully!");
        navigate('/'); // Redirect back to the student list
      })
      .catch(error => console.error(error));
  };

  return (
    <div>
      <h2>Add New Student</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', width: '300px', gap: '10px' }}>
        <input type="text" name="name" placeholder="Full Name" onChange={handleChange} required />
        <input type="text" name="rollNumber" placeholder="Roll Number" onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email Address" onChange={handleChange} required />
        <input type="text" name="phoneNumber" placeholder="Phone Number" onChange={handleChange} />
        <select name="department" onChange={handleChange} required className="custom-select" style={{width: '100%'}}>
          <option value="">Select Department</option>
          <option value="CS">CS</option>
          <option value="IT">IT</option>
          <option value="Mechanical">Mechanical</option>
          <option value="E&C">E&C</option>
        </select>
        <label>Academic Year</label>
        <select name="academicYear" onChange={handleChange} required className="custom-select">
          <option value="">Select Year</option>
          <option value="1">1st Year</option>
          <option value="2">2nd Year</option>
          <option value="3">3rd Year</option>
          <option value="4">4th Year</option>
        </select>
        <input type="text" name="address" placeholder="Address" onChange={handleChange} />
        <button type="submit" style={{ padding: '10px', backgroundColor: '#4CAF50', color: 'white', cursor: 'pointer' }}>Save Student</button>
      </form>
    </div>
  );
}

export default AddStudent;