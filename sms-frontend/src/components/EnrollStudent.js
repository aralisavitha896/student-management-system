import React, { useState, useEffect } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';

function EnrollStudent() {
    const navigate = useNavigate();
    const [enrollment, setEnrollment] = useState({ studentId: '', subjectId: '' });
    const [students, setStudents] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        // Fetch all students
        api.get('/api/students')
            .then(res => setStudents(res.data))
            .catch(err => console.error(err));

        // Fetch all subjects
        api.get('/api/subjects')
            .then(res => setSubjects(res.data))
            .catch(err => console.error(err));
    }, []);

    const filteredStudents = students.filter(s => 
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        s.rollNumber.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSubmit = (e) => {
        e.preventDefault();
        api.post('/api/enrollments', enrollment)
            .then(res => {
                alert("Student Enrolled Successfully!");
                navigate('/');
            })
            .catch(err => {
                console.error(err);
                alert("Error: " + (err.response?.data || err.message));
            });
    };

    return (
        <div className="dashboard-container">
            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                <h2 style={{ fontSize: '28px', color: '#111827' }}>Admin: Student Enrollment</h2>
                <p style={{ color: '#6b7280' }}>Link students to subjects to begin tracking their performance.</p>
            </div>

            <div className="form-card" style={{ maxWidth: '700px' }}>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Search Student</label>
                        <input 
                            type="text" 
                            className="custom-input" 
                            style={{ width: '100%', marginBottom: '10px' }}
                            placeholder="Type student name or roll number to filter..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label>Select Student</label>
                        <select 
                            className="custom-select" 
                            style={{ width: '100%' }} 
                            value={enrollment.studentId} 
                            onChange={(e) => setEnrollment({...enrollment, studentId: e.target.value})} 
                            required
                        >
                            <option value="">-- {filteredStudents.length} Students Found --</option>
                            {filteredStudents.map(s => (
                                <option key={s.id} value={s.id}>{s.name} ({s.rollNumber})</option>
                            ))}
                        </select>
                        {searchTerm && filteredStudents.length === 0 && (
                            <span className="error-text">No students match your search.</span>
                        )}
                    </div>

                    <div className="form-group">
                        <label>Select Subject</label>
                        <select 
                            className="custom-select" 
                            style={{ width: '100%' }} 
                            value={enrollment.subjectId} 
                            onChange={(e) => setEnrollment({...enrollment, subjectId: e.target.value})} 
                            required
                        >
                            <option value="">-- Choose Subject --</option>
                            {subjects.map(sub => (
                                <option key={sub.id} value={sub.id}>{sub.subjectName} ({sub.subjectCode})</option>
                            ))}
                        </select>
                    </div>

                    <button type="submit" className="btn btn-add" style={{ width: '100%', padding: '12px', fontSize: '16px', marginTop: '10px' }}>
                        Confirm Enrollment
                    </button>
                </form>
            </div>
        </div>
    );
}

export default EnrollStudent;
