import React, { useState, useEffect } from 'react';
import api from '../api';

function FacultyList() {
    const [faculties, setFaculties] = useState([]);

    useEffect(() => {
        fetchFaculties();
    }, []);

    const fetchFaculties = () => {
        api.get('/api/faculty')
            .then(res => setFaculties(res.data))
            .catch(err => console.error(err));
    };

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this faculty member?")) {
            api.delete(`/api/faculty/${id}`)
                .then(() => {
                    alert("Faculty Deleted!");
                    fetchFaculties();
                })
                .catch(err => alert("Error deleting: " + err.message));
        }
    };

    return (
        <div className="dashboard-container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2>Faculty Management</h2>
            </div>
            <div style={{ background: '#fff', borderRadius: '10px', padding: '20px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                <table className="custom-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Department</th>
                            <th>Phone</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {faculties.map(f => (
                            <tr key={f.id}>
                                <td><strong>{f.name}</strong></td>
                                <td>{f.email}</td>
                                <td>{f.department}</td>
                                <td>{f.phoneNumber}</td>
                                <td>
                                    <button className="btn btn-delete" onClick={() => handleDelete(f.id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                        {faculties.length === 0 && (
                            <tr>
                                <td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>No faculty members found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default FacultyList;
