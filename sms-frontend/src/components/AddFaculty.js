import React, { useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';

function AddFaculty() {
    const navigate = useNavigate();
    const [faculty, setFaculty] = useState({
        name: '',
        email: '',
        phoneNumber: '',
        department: ''
    });

    const [errors, setErrors] = useState({});

    const validate = () => {
        let tempErrors = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^\d{10}$/;

        if (!faculty.name) tempErrors.name = "Name is required";
        if (!faculty.email) {
            tempErrors.email = "Email is required";
        } else if (!emailRegex.test(faculty.email)) {
            tempErrors.email = "Invalid email format";
        }

        if (faculty.phoneNumber && !phoneRegex.test(faculty.phoneNumber)) {
            tempErrors.phoneNumber = "Phone number must be 10 digits";
        }

        if (!faculty.department) tempErrors.department = "Department is required";

        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleChange = (e) => {
        setFaculty({ ...faculty, [e.target.name]: e.target.value });
        if (errors[e.target.name]) {
            setErrors({ ...errors, [e.target.name]: null });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validate()) return;

        api.post('/api/faculty', faculty)
            .then(response => {
                alert("Faculty Added Successfully!");
                navigate('/');
            })
            .catch(error => {
                console.error(error);
                alert("Error adding faculty: " + (error.response?.data || error.message));
            });
    };

    return (
        <div className="dashboard-container">
            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                <h2 style={{ fontSize: '28px', color: '#111827' }}>Admin: Add New Faculty</h2>
                <p style={{ color: '#6b7280' }}>Register a new faculty member to manage subjects and students.</p>
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
                            placeholder="e.g. Dr. John Doe" 
                            onChange={handleChange} 
                        />
                        {errors.name && <span className="error-text">{errors.name}</span>}
                    </div>
                    
                    <div className="form-group">
                        <label>Email Address</label>
                        <input 
                            className={`custom-input ${errors.email ? 'input-error' : ''}`}
                            style={{ width: '100%' }}
                            type="email" 
                            name="email" 
                            placeholder="e.g. faculty@sms.com" 
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
                            placeholder="e.g. 1234567890" 
                            onChange={handleChange} 
                        />
                        {errors.phoneNumber && <span className="error-text">{errors.phoneNumber}</span>}
                    </div>

                    <div className="form-group">
                        <label>Department</label>
                        <select 
                            name="department" 
                            className={`custom-select ${errors.department ? 'input-error' : ''}`}
                            style={{ width: '100%' }}
                            onChange={handleChange}
                        >
                            <option value="">Select Department</option>
                            <option value="CS">CS</option>
                            <option value="IT">IT</option>
                            <option value="Mechanical">Mechanical</option>
                            <option value="E&C">E&C</option>
                        </select>
                        {errors.department && <span className="error-text">{errors.department}</span>}
                    </div>

                    <div style={{ padding: '15px', background: '#fef3c7', borderRadius: '8px', border: '1px solid #fcd34d', marginBottom: '20px' }}>
                        <p style={{ margin: 0, fontSize: '13px', color: '#92400e', fontWeight: '500' }}>
                            <strong>Note:</strong> The default password will be <code>faculty123</code>.
                        </p>
                    </div>

                    <button type="submit" className="btn btn-add" style={{ width: '100%', padding: '12px', fontSize: '16px' }}>
                        Create Faculty Account
                    </button>
                </form>
            </div>
        </div>
    );
}

export default AddFaculty;
