import React, { useState, useEffect } from 'react';
import api from '../api';

function AddSubject() {
    const [subject, setSubject] = useState({ subjectCode: '', subjectName: '', credits: '', semester: '', facultyId: '' });
    const [faculties, setFaculties] = useState([]);

    useEffect(() => {
        api.get('/api/faculty')
            .then(res => setFaculties(res.data))
            .catch(err => console.error(err));
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        api.post('/api/subjects', subject)
            .then(res => {
                alert("Subject Added Successfully!");
                setSubject({ subjectCode: '', subjectName: '', credits: '', semester: '', facultyId: '' });
            })
            .catch(err => console.error(err));
    };

    return (
        <div className="dashboard-container" style={{maxWidth: '600px', margin: '50px auto'}}>
            <h2>Admin: Add New Subject</h2>
            <div style={{background: 'white', padding: '30px', borderRadius: '15px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', border: '1px solid #e5e7eb'}}>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <label>Subject Code</label>
                        <input className="custom-input" type="text" placeholder="e.g. CS101" value={subject.subjectCode} onChange={(e) => setSubject({...subject, subjectCode: e.target.value})} required />
                    </div>
                    
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <label>Subject Name</label>
                        <input className="custom-input" type="text" placeholder="e.g. Data Structures" value={subject.subjectName} onChange={(e) => setSubject({...subject, subjectName: e.target.value})} required />
                    </div>

                    <div style={{ display: 'flex', gap: '15px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                            <label>Credits</label>
                            <input className="custom-input" type="number" placeholder="e.g. 3" value={subject.credits} onChange={(e) => setSubject({...subject, credits: e.target.value})} required />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                            <label>Semester</label>
                            <input className="custom-input" type="number" placeholder="e.g. 1" value={subject.semester} onChange={(e) => setSubject({...subject, semester: e.target.value})} required />
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <label>Assign to Faculty</label>
                        <select className="custom-select" value={subject.facultyId} onChange={(e) => setSubject({...subject, facultyId: e.target.value})} required>
                            <option value="">-- Select Faculty --</option>
                            {faculties.map(f => (
                                <option key={f.id} value={f.id}>{f.name} ({f.department})</option>
                            ))}
                        </select>
                    </div>

                    <button type="submit" className="btn btn-add" style={{ marginTop: '10px' }}>Create Subject</button>
                </form>
            </div>
        </div>
    );
}

export default AddSubject;