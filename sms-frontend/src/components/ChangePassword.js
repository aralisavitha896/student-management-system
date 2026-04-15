import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function ChangePassword({ user }) {
  const [passwords, setPasswords] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      alert("New passwords do not match!");
      return;
    }

    axios.post(`http://localhost:8080/api/students/${user.id}/change-password`, {
      oldPassword: passwords.oldPassword,
      newPassword: passwords.newPassword
    })
    .then(res => {
      alert(res.data.message);
      navigate('/');
    })
    .catch(err => alert(err.response?.data || "Error changing password"));
  };

  return (
    <div className="dashboard-container" style={{maxWidth: '400px'}}>
      <h2>Change Password</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <input className="custom-input" type="password" name="oldPassword" placeholder="Current Password" onChange={handleChange} required />
        <input className="custom-input" type="password" name="newPassword" placeholder="New Password" onChange={handleChange} required />
        <input className="custom-input" type="password" name="confirmPassword" placeholder="Confirm New Password" onChange={handleChange} required />
        <button type="submit" className="btn btn-edit">Update Password</button>
      </form>
    </div>
  );
}

export default ChangePassword;